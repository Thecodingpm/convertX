<?php

namespace App\Modules\PdfTools\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $action = $this->route('action');

        $rules = [
            'file' => ['required', 'file', 'max:102400'],
        ];

        switch ($action) {
            case 'pdf-to-word':
            case 'pdf-to-excel':
            case 'pdf-to-jpg':
            case 'compress':
                $rules['file'][] = 'mimes:pdf';
                break;

            case 'merge':
                $rules = [
                    'files' => ['required', 'array', 'min:2'],
                    'files.*' => ['file', 'mimes:pdf', 'max:102400'],
                ];
                break;

            case 'split':
            case 'extract-pages':
                $rules['file'][] = 'mimes:pdf';
                $rules['from_page'] = ['required_if:action,split', 'integer', 'min:1'];
                $rules['to_page'] = ['required_if:action,split', 'integer', 'min:1'];
                $rules['pages'] = ['required_if:action,extract-pages', 'string'];
                break;

            case 'add-password':
                $rules['file'][] = 'mimes:pdf';
                $rules['password'] = ['required', 'string', 'min:4'];
                break;

            case 'remove-password':
                $rules['file'][] = 'mimes:pdf';
                $rules['password'] = ['required', 'string'];
                break;

            case 'watermark':
                $rules['file'][]         = 'mimes:pdf';
                $rules['watermark_text'] = ['required', 'string', 'max:100'];
                $rules['position']       = ['sometimes', 'string', 'in:top-left,top-center,top-right,center-left,center,center-right,bottom-left,bottom-center,bottom-right'];
                $rules['opacity']        = ['sometimes', 'numeric', 'min:0.05', 'max:1'];
                $rules['color']          = ['sometimes', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'];
                $rules['font_size']      = ['sometimes', 'integer', 'min:10', 'max:200'];
                $rules['rotation']       = ['sometimes', 'integer', 'min:0', 'max:360'];
                $rules['pages']          = ['sometimes', 'string'];
                break;
            case 'pptx-to-pdf':
            case 'pptx-to-word':
            case 'pptx-to-jpg':
            case 'pptx-to-png':
                $rules['file'] = [
                    'required', 'file', 'max:102400',
                    'mimetypes:application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/mspowerpoint,application/powerpoint,application/x-mspowerpoint',
                ];
                break;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'file.mimes'         => 'Please upload a valid PDF file.',
            'file.mimetypes'     => 'Please upload a valid PowerPoint (.pptx) file.',
            'file.max'           => 'File size must not exceed 100MB.',
            'files.min'          => 'At least 2 PDF files are required for merging.',
            'password.required'  => 'Password is required for this operation.',
        ];
    }
}
