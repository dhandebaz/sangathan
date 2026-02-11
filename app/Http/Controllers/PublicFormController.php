<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\FormSubmissionValue;
use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PublicFormController extends Controller
{
    /**
     * Show a public form.
     */
    public function show($organisationSlug, $formId)
    {
        $organisation = Organisation::where('slug', $organisationSlug)->firstOrFail();
        
        $form = Form::where('id', $formId)
                   ->where('organisation_id', $organisation->id)
                   ->where('is_public', true)
                   ->where('is_active', true)
                   ->with(['fields'])
                   ->firstOrFail();

        return view('forms.public.show', compact('form', 'organisation'));
    }

    /**
     * Handle form submission.
     */
    public function submit(Request $request, $organisationSlug, $formId)
    {
        $organisation = Organisation::where('slug', $organisationSlug)->firstOrFail();
        
        $form = Form::where('id', $formId)
                   ->where('organisation_id', $organisation->id)
                   ->where('is_public', true)
                   ->where('is_active', true)
                   ->with(['fields'])
                   ->firstOrFail();

        // Rate limiting
        $rateLimitKey = 'form-submission-' . $formId . '-' . $request->ip();
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            return back()->with('error', 'Too many submissions. Please try again later.')
                        ->withInput();
        }

        // Validate all fields
        $rules = [];
        $messages = [];

        foreach ($form->fields as $field) {
            $fieldValidation = $field->validateValue($request->input('field_' . $field->id));
            $rules['field_' . $field->id] = $fieldValidation['rules'];
            if (!empty($fieldValidation['messages'])) {
                $messages['field_' . $field->id . '.*'] = $fieldValidation['messages']['field_' . $field->id . '.*'] ?? [];
            }
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Handle file uploads
        $filePaths = [];
        foreach ($form->fields as $field) {
            if ($field->field_type === 'file' && $request->hasFile('field_' . $field->id)) {
                $file = $request->file('field_' . $field->id);
                $filename = Str::slug($field->label) . '-' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('form-submissions/' . $form->id, $filename, 'public');
                $filePaths[$field->id] = $path;
            }
        }

        // Create submission
        $submission = FormSubmission::create([
            'form_id' => $form->id,
            'submitted_at' => now(),
            'submitter_ip' => $request->ip(),
            'submitter_user_agent' => substr($request->userAgent() ?? '', 0, 500),
        ]);

        // Create submission values
        foreach ($form->fields as $field) {
            $value = null;

            if ($field->field_type === 'file') {
                $value = $filePaths[$field->id] ?? null;
            } elseif ($field->field_type === 'checkbox') {
                $selectedOptions = $request->input('field_' . $field->id, []);
                $value = !empty($selectedOptions) ? json_encode($selectedOptions) : null;
            } else {
                $value = $request->input('field_' . $field->id);
            }

            FormSubmissionValue::create([
                'submission_id' => $submission->id,
                'field_id' => $field->id,
                'value' => $value,
            ]);
        }

        // Increment rate limit counter
        RateLimiter::hit($rateLimitKey, 3600); // 1 hour window

        return redirect()->route('public.forms.success', [
            'organisation' => $organisationSlug,
            'form' => $formId,
        ])->with('success', 'Form submitted successfully!');
    }

    /**
     * Show success page after form submission.
     */
    public function success($organisationSlug, $formId)
    {
        $organisation = Organisation::where('slug', $organisationSlug)->firstOrFail();
        
        $form = Form::where('id', $formId)
                   ->where('organisation_id', $organisation->id)
                   ->where('is_public', true)
                   ->where('is_active', true)
                   ->firstOrFail();

        return view('forms.public.success', compact('form', 'organisation'));
    }
}