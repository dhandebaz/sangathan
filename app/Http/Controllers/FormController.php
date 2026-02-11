<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    /**
     * Display a listing of the forms.
     */
    public function index()
    {
        $organisationId = session('current_organisation_id');
        
        $forms = Form::forOrganisation($organisationId)
                    ->with(['creator', 'fields'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(15);
        
        return view('forms.index', compact('forms'));
    }

    /**
     * Show the form for creating a new form.
     */
    public function create()
    {
        return view('forms.create');
    }

    /**
     * Store a newly created form in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $organisationId = session('current_organisation_id');

        $form = Form::create([
            'organisation_id' => $organisationId,
            'title' => $request->title,
            'description' => $request->description,
            'is_public' => $request->boolean('is_public', false),
            'is_active' => $request->boolean('is_active', true),
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('forms.builder', $form)
                        ->with('success', 'Form created successfully. Now add fields to your form.');
    }

    /**
     * Show the form builder for the specified form.
     */
    public function builder(Form $form)
    {
        $this->authorize('update', $form);
        
        $form->load(['fields']);
        
        return view('forms.builder', compact('form'));
    }

    /**
     * Add a field to the form.
     */
    public function addField(Request $request, Form $form)
    {
        $this->authorize('update', $form);

        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255',
            'field_type' => 'required|in:text,textarea,email,phone,number,dropdown,checkbox,date,file',
            'is_required' => 'boolean',
            'options' => 'nullable|array',
            'options.*' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $maxPosition = $form->fields()->max('position') ?? -1;

        $field = $form->fields()->create([
            'label' => $request->label,
            'field_type' => $request->field_type,
            'is_required' => $request->boolean('is_required', false),
            'options' => in_array($request->field_type, ['dropdown', 'checkbox']) ? $request->options : null,
            'position' => $maxPosition + 1,
        ]);

        return response()->json([
            'success' => true,
            'field' => $field,
        ]);
    }

    /**
     * Update field order.
     */
    public function updateFieldOrder(Request $request, Form $form)
    {
        $this->authorize('update', $form);

        $validator = Validator::make($request->all(), [
            'field_ids' => 'required|array',
            'field_ids.*' => 'exists:form_fields,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::transaction(function () use ($request, $form) {
            foreach ($request->field_ids as $index => $fieldId) {
                $form->fields()->where('id', $fieldId)->update(['position' => $index]);
            }
        });

        return response()->json(['success' => true]);
    }

    /**
     * Delete a field from the form.
     */
    public function deleteField(Form $form, FormField $field)
    {
        $this->authorize('update', $form);

        if ($field->form_id !== $form->id) {
            return response()->json(['error' => 'Field not found in this form'], 404);
        }

        $field->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Show the form for editing the specified form.
     */
    public function edit(Form $form)
    {
        $this->authorize('update', $form);
        
        return view('forms.edit', compact('form'));
    }

    /**
     * Update the specified form in storage.
     */
    public function update(Request $request, Form $form)
    {
        $this->authorize('update', $form);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $form->update([
            'title' => $request->title,
            'description' => $request->description,
            'is_public' => $request->boolean('is_public'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('forms.index')->with('success', 'Form updated successfully.');
    }

    /**
     * Remove the specified form from storage.
     */
    public function destroy(Form $form)
    {
        $this->authorize('delete', $form);

        $form->delete();

        return redirect()->route('forms.index')->with('success', 'Form deleted successfully.');
    }
}