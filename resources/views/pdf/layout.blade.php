<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Sangathan PDF')</title>
    <style>
        /* PDF-friendly styles */
        body {
            font-family: 'Inter', sans-serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .header {
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .organisation-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .organisation-type {
            font-size: 12px;
            color: #666;
        }
        
        .document-title {
            font-size: 16px;
            font-weight: bold;
            margin: 15px 0;
        }
        
        .document-info {
            font-size: 10px;
            color: #666;
            margin-bottom: 20px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th {
            background-color: #f5f5f5;
            border: 1px solid #000;
            padding: 8px;
            font-weight: bold;
            text-align: left;
        }
        
        td {
            border: 1px solid #000;
            padding: 8px;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #000;
            font-size: 10px;
            text-align: center;
            color: #666;
        }
        
        .disclaimer {
            font-size: 10px;
            color: #666;
            font-style: italic;
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
        }
        
        .signature-section {
            margin-top: 40px;
        }
        
        .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            margin-top: 40px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .mb-4 {
            margin-bottom: 16px;
        }
        
        .mt-4 {
            margin-top: 16px;
        }
    </style>
</head>
<body>
    @yield('content')
</body>
</html>