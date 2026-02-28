<?php

namespace App\Modules\PdfTools\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class PdfService
{
    // Full absolute paths — Laravel Process doesn't inherit shell PATH
    private string $gs = 'gs';
    private string $libreOffice = 'soffice';
    private string $python = 'python3';


    /**
     * Convert PDF to Word (DOCX) using pypdf + python-docx (pure Python, no C++ deps).
     * Extracts text page by page and writes to a styled DOCX file.
     */
    public function pdfToWord(string $inputPath, string $outputDir): string
    {
        $safeInput  = $outputDir . '/convert_in_'  . uniqid() . '.pdf';
        $outputFile = $outputDir . '/convert_out_' . uniqid() . '.docx';
        $scriptFile = $outputDir . '/convert_'     . uniqid() . '.py';

        copy($inputPath, $safeInput);

        // Pure Python: pypdf for reading, python-docx for writing — no PyMuPDF needed
        $pyScript = <<<'PYTHON'
import sys
from pypdf import PdfReader
from docx import Document
from docx.shared import Pt

reader = PdfReader(r'INPUT_PATH')
doc = Document()
doc.add_heading('Converted Document', 0)

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        doc.add_heading('Page ' + str(i + 1), level=2)
        for line in text.split(chr(10)):
            line = line.strip()
            if line:
                p = doc.add_paragraph(line)
                p.style.font.size = Pt(11)

doc.save(r'OUTPUT_PATH')
print('done')
PYTHON;

        $pyScript = str_replace('INPUT_PATH', $safeInput, $pyScript);
        $pyScript = str_replace('OUTPUT_PATH', $outputFile, $pyScript);

        file_put_contents($scriptFile, $pyScript);

        $result = Process::run(
            escapeshellarg($this->python) . ' ' . escapeshellarg($scriptFile)
        );

        @unlink($safeInput);
        @unlink($scriptFile);

        if ($result->failed() || !file_exists($outputFile)) {
            Log::error('PDF to Word failed', [
                'error'  => $result->errorOutput(),
                'stdout' => $result->output(),
            ]);
            throw new \RuntimeException('PDF to Word conversion failed: ' . $result->errorOutput());
        }

        return $outputFile;
    }


    /**
     * Convert PDF to Excel (XLSX) using pdfplumber + openpyxl (Python).
     * LibreOffice xlsx export filter is missing on this system.
     */
    public function pdfToExcel(string $inputPath, string $outputDir): string
    {
        $safeInput  = $outputDir . '/convert_in_'  . uniqid() . '.pdf';
        $outputFile = $outputDir . '/convert_out_' . uniqid() . '.xlsx';
        $scriptFile = $outputDir . '/convert_'     . uniqid() . '.py';

        copy($inputPath, $safeInput);

        // Write Python script — avoids all shell path-escaping issues
        $pyScript = <<<'PYTHON'
import pdfplumber
import openpyxl

wb = openpyxl.Workbook()
wb.remove(wb.active)  # remove default sheet

with pdfplumber.open(r'INPUT_PATH') as pdf:
    for page_num, page in enumerate(pdf.pages, start=1):
        ws = wb.create_sheet(title='Page ' + str(page_num))
        tables = page.extract_tables()
        if tables:
            row_idx = 1
            for table in tables:
                for row in table:
                    ws.append([cell if cell is not None else '' for cell in row])
                    row_idx += 1
                ws.append([])  # blank row between tables
        else:
            # No tables: dump raw text line by line
            text = page.extract_text() or ''
            for line in text.split(chr(10)):
                ws.append([line])

wb.save(r'OUTPUT_PATH')
PYTHON;

        $pyScript = str_replace('INPUT_PATH', $safeInput, $pyScript);
        $pyScript = str_replace('OUTPUT_PATH', $outputFile, $pyScript);

        file_put_contents($scriptFile, $pyScript);

        $result = Process::run(
            escapeshellarg($this->python) . ' ' . escapeshellarg($scriptFile)
        );

        @unlink($safeInput);
        @unlink($scriptFile);

        if ($result->failed() || !file_exists($outputFile)) {
            Log::error('PDF to Excel failed', [
                'error'  => $result->errorOutput(),
                'stdout' => $result->output(),
            ]);
            throw new \RuntimeException('PDF to Excel conversion failed: ' . $result->errorOutput());
        }

        return $outputFile;
    }


    /**
     * Convert PDF to JPG using Ghostscript
     */
    public function pdfToJpg(string $inputPath, string $outputPath): string
    {
        $result = Process::run(
            escapeshellarg($this->gs) . " -sDEVICE=jpeg -dNOPAUSE -dBATCH -dSAFER -r300 -sOutputFile=" . escapeshellarg($outputPath) . " " . escapeshellarg($inputPath)
        );

        if ($result->failed()) {
            throw new \RuntimeException('PDF to JPG conversion failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Merge multiple PDFs using Ghostscript
     */
    public function mergePdfs(array $inputPaths, string $outputPath): string
    {
        $files = implode(' ', array_map('escapeshellarg', $inputPaths));
        $result = Process::run(
            escapeshellarg($this->gs) . " -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -sOutputFile=" . escapeshellarg($outputPath) . " " . $files
        );

        if ($result->failed()) {
            throw new \RuntimeException('PDF merge failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Split PDF - extract specific pages using Ghostscript
     */
    public function splitPdf(string $inputPath, string $outputPath, int $fromPage, int $toPage): string
    {
        $result = Process::run(
            escapeshellarg($this->gs) . " -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dFirstPage={$fromPage} -dLastPage={$toPage} -sOutputFile=" . escapeshellarg($outputPath) . " " . escapeshellarg($inputPath)
        );

        if ($result->failed()) {
            throw new \RuntimeException('PDF split failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Compress PDF using Ghostscript
     */
    public function compressPdf(string $inputPath, string $outputPath, string $quality = '/ebook'): string
    {
        $result = Process::run(
            escapeshellarg($this->gs) . " -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -dCompatibilityLevel=1.4 -dPDFSETTINGS={$quality} -sOutputFile=" . escapeshellarg($outputPath) . " " . escapeshellarg($inputPath)
        );

        if ($result->failed()) {
            throw new \RuntimeException('PDF compression failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Add password protection to PDF using pypdf (pure Python, no Ghostscript dependency)
     */
    public function addPassword(string $inputPath, string $outputPath, string $password): string
    {
        $safeInput  = dirname($outputPath) . '/convert_in_'  . uniqid() . '.pdf';
        $scriptFile = dirname($outputPath) . '/convert_'     . uniqid() . '.py';
        copy($inputPath, $safeInput);

        $safePassword = addslashes($password);

        $pyScript = <<<'PYTHON'
from pypdf import PdfReader, PdfWriter

reader = PdfReader(r'INPUT_PATH')
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

writer.encrypt(r'PASSWORD')

with open(r'OUTPUT_PATH', 'wb') as f:
    writer.write(f)
PYTHON;

        $pyScript = str_replace('INPUT_PATH', $safeInput, $pyScript);
        $pyScript = str_replace('OUTPUT_PATH', $outputPath, $pyScript);
        $pyScript = str_replace('PASSWORD', $safePassword, $pyScript);

        file_put_contents($scriptFile, $pyScript);

        $result = Process::run(
            escapeshellarg($this->python) . ' ' . escapeshellarg($scriptFile)
        );

        @unlink($safeInput);
        @unlink($scriptFile);

        if ($result->failed() || !file_exists($outputPath)) {
            throw new \RuntimeException('PDF password protection failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Remove password from PDF using pypdf (pure Python, no Ghostscript dependency)
     */
    public function removePassword(string $inputPath, string $outputPath, string $password): string
    {
        $safeInput  = dirname($outputPath) . '/convert_in_'  . uniqid() . '.pdf';
        $scriptFile = dirname($outputPath) . '/convert_'     . uniqid() . '.py';
        copy($inputPath, $safeInput);

        $safePassword = addslashes($password);

        $pyScript = <<<'PYTHON'
from pypdf import PdfReader, PdfWriter

reader = PdfReader(r'INPUT_PATH')
if reader.is_encrypted:
    reader.decrypt(r'PASSWORD')

writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)

with open(r'OUTPUT_PATH', 'wb') as f:
    writer.write(f)
PYTHON;

        $pyScript = str_replace('INPUT_PATH', $safeInput, $pyScript);
        $pyScript = str_replace('OUTPUT_PATH', $outputPath, $pyScript);
        $pyScript = str_replace('PASSWORD', $safePassword, $pyScript);

        file_put_contents($scriptFile, $pyScript);

        $result = Process::run(
            escapeshellarg($this->python) . ' ' . escapeshellarg($scriptFile)
        );

        @unlink($safeInput);
        @unlink($scriptFile);

        if ($result->failed() || !file_exists($outputPath)) {
            throw new \RuntimeException('PDF password removal failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Add watermark to PDF — full options via Python (reportlab + pypdf)
     *
     * @param string $position  One of: top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right
     * @param float  $opacity   0.0–1.0
     * @param string $color     Hex color e.g. '#ff0000'
     * @param int    $fontSize  Font size in pt
     * @param int    $rotation  Degrees (0–360)
     * @param string $pages     'all' | 'first' | 'last' | '1,3,5' | '2-5'
     */
    public function addWatermark(
        string $inputPath,
        string $outputPath,
        string $watermarkText,
        string $position = 'center',
        float  $opacity  = 0.3,
        string $color    = '#808080',
        int    $fontSize = 60,
        int    $rotation = 45,
        string $pages    = 'all'
    ): string {
        $safeInput  = dirname($outputPath) . '/wm_in_'  . uniqid() . '.pdf';
        $scriptFile = dirname($outputPath) . '/wm_'     . uniqid() . '.py';
        copy($inputPath, $safeInput);

        // Escape the watermark text for embedding in the Python string literal
        $safeText   = addslashes($watermarkText);
        $safePages  = addslashes($pages);

        $pyScript = <<<'PYTHON'
import io, re
from reportlab.pdfgen import canvas
from pypdf import PdfReader, PdfWriter

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def make_wm_page(pw, ph, text, position, opacity, color_hex, font_size, rotation):
    r, g, b = hex_to_rgb(color_hex)
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(pw, ph))
    c.setFillColorRGB(r, g, b, alpha=opacity)
    c.setFont("Helvetica-Bold", font_size)
    tw = c.stringWidth(text, "Helvetica-Bold", font_size)
    margin = max(40, font_size)
    pos_map = {
        'top-left':      (margin + tw/2,      ph - margin - font_size/2),
        'top-center':    (pw/2,                ph - margin - font_size/2),
        'top-right':     (pw - margin - tw/2,  ph - margin - font_size/2),
        'center-left':   (margin + tw/2,       ph/2),
        'center':        (pw/2,                ph/2),
        'center-right':  (pw - margin - tw/2,  ph/2),
        'bottom-left':   (margin + tw/2,       margin + font_size/2),
        'bottom-center': (pw/2,                margin + font_size/2),
        'bottom-right':  (pw - margin - tw/2,  margin + font_size/2),
    }
    x, y = pos_map.get(position, (pw/2, ph/2))
    c.saveState()
    c.translate(x, y)
    c.rotate(rotation)
    c.drawCentredString(0, 0, text)
    c.restoreState()
    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]

reader = PdfReader(r'INPUT_PATH')
writer = PdfWriter()
total  = len(reader.pages)

pages_str = r'PAGES_STR'
if pages_str == 'all':
    selected = list(range(total))
elif pages_str == 'first':
    selected = [0]
elif pages_str == 'last':
    selected = [total - 1]
elif '-' in pages_str and ',' not in pages_str:
    parts = pages_str.split('-')
    selected = list(range(int(parts[0]) - 1, int(parts[1])))
else:
    selected = [int(p) - 1 for p in re.split(r'[\s,]+', pages_str) if p.strip().isdigit()]

for i, page in enumerate(reader.pages):
    if i in selected:
        pw = float(page.mediabox.width)
        ph = float(page.mediabox.height)
        wm = make_wm_page(pw, ph, r'TEXT_STR', 'POSITION_STR', OPACITY_VAL, 'COLOR_HEX', FONT_SIZE_VAL, ROTATION_VAL)
        # over=True stamps watermark ON TOP of existing page content
        page.merge_page(wm, over=True)
        writer.add_page(page)
    else:
        writer.add_page(page)

with open(r'OUTPUT_PATH', 'wb') as f:
    writer.write(f)
PYTHON;

        $pyScript = str_replace('INPUT_PATH', $safeInput, $pyScript);
        $pyScript = str_replace('PAGES_STR', $safePages, $pyScript);
        $pyScript = str_replace('TEXT_STR', $safeText, $pyScript);
        $pyScript = str_replace('POSITION_STR', $position, $pyScript);
        $pyScript = str_replace('OPACITY_VAL', (string)$opacity, $pyScript);
        $pyScript = str_replace('COLOR_HEX', $color, $pyScript);
        $pyScript = str_replace('FONT_SIZE_VAL', (string)$fontSize, $pyScript);
        $pyScript = str_replace('ROTATION_VAL', (string)$rotation, $pyScript);
        $pyScript = str_replace('OUTPUT_PATH', $outputPath, $pyScript);

        file_put_contents($scriptFile, $pyScript);

        $result = Process::run(
            escapeshellarg($this->python) . ' ' . escapeshellarg($scriptFile)
        );

        @unlink($safeInput);
        @unlink($scriptFile);

        if ($result->failed() || !file_exists($outputPath)) {
            Log::error('Watermark failed', [
                'error'  => $result->errorOutput(),
                'stdout' => $result->output(),
            ]);
            throw new \RuntimeException('Watermark failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }



    /**
     * Extract specific pages from PDF
     */
    public function extractPages(string $inputPath, string $outputPath, array $pages): string
    {
        $pageList = implode(',', $pages);
        $result = Process::run(
            escapeshellarg($this->gs) . " -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -sPageList={$pageList} -sOutputFile=" . escapeshellarg($outputPath) . " " . escapeshellarg($inputPath)
        );

        if ($result->failed()) {
            throw new \RuntimeException('Page extraction failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PPTX Converters — LibreOffice handles PPTX natively
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Internal helper: run LibreOffice headless conversion on a PPTX file.
     * LibreOffice writes the output into $outDir with a predictable filename.
     * Returns the full path to the generated file.
     */
    private function libreConvert(string $inputPath, string $filterName, string $expectedExt, string $outDir): string
    {
        // Copy input to a temp file with .pptx extension so LibreOffice recognises it
        $safeInput = $outDir . '/pptx_in_' . uniqid() . '.pptx';
        copy($inputPath, $safeInput);

        $result = Process::run(
            escapeshellarg($this->libreOffice) .
            " --headless --norestore --convert-to " . escapeshellarg($filterName) .
            " --outdir " . escapeshellarg($outDir) .
            " " . escapeshellarg($safeInput)
        );

        @unlink($safeInput);

        if ($result->failed()) {
            Log::error('LibreOffice PPTX conversion failed', [
                'filter' => $filterName,
                'error'  => $result->errorOutput(),
                'stdout' => $result->output(),
            ]);
            throw new \RuntimeException('PPTX conversion failed: ' . $result->errorOutput());
        }

        // LibreOffice names the output after the input file
        $baseName   = pathinfo($safeInput, PATHINFO_FILENAME);
        $outputFile = $outDir . '/' . $baseName . '.' . $expectedExt;

        if (!file_exists($outputFile)) {
            // Fallback: find any file with the expected extension created very recently
            $files = glob($outDir . '/*.' . $expectedExt);
            if (!empty($files)) {
                usort($files, fn($a, $b) => filemtime($b) - filemtime($a));
                $outputFile = $files[0];
            } else {
                throw new \RuntimeException("PPTX conversion output not found (expected: {$outputFile})");
            }
        }

        return $outputFile;
    }

    /**
     * Convert PPTX to PDF using LibreOffice
     */
    public function pptxToPdf(string $inputPath, string $outputPath): string
    {
        $outDir  = dirname($outputPath);
        $tmpFile = $this->libreConvert($inputPath, 'pdf', 'pdf', $outDir);
        rename($tmpFile, $outputPath);
        return $outputPath;
    }

    /**
     * Convert PPTX to Word (DOCX) using LibreOffice
     */
    public function pptxToWord(string $inputPath, string $outputPath): string
    {
        $outDir  = dirname($outputPath);
        $tmpFile = $this->libreConvert($inputPath, 'docx', 'docx', $outDir);
        rename($tmpFile, $outputPath);
        return $outputPath;
    }

    /**
     * Convert PPTX to JPG — via PDF intermediate then Ghostscript rasterisation
     */
    public function pptxToJpg(string $inputPath, string $outputPath): string
    {
        $outDir  = dirname($outputPath);
        $pdfTmp  = $outDir . '/pptx_pdf_' . uniqid() . '.pdf';

        $this->pptxToPdf($inputPath, $pdfTmp);

        $result = Process::run(
            escapeshellarg($this->gs) .
            " -sDEVICE=jpeg -dNOPAUSE -dBATCH -dSAFER -r150 -sOutputFile=" .
            escapeshellarg($outputPath) . " " . escapeshellarg($pdfTmp)
        );

        @unlink($pdfTmp);

        if ($result->failed()) {
            throw new \RuntimeException('PPTX to JPG rasterisation failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    /**
     * Convert PPTX to PNG — via PDF intermediate then Ghostscript rasterisation
     */
    public function pptxToPng(string $inputPath, string $outputPath): string
    {
        $outDir  = dirname($outputPath);
        $pdfTmp  = $outDir . '/pptx_pdf_' . uniqid() . '.pdf';

        $this->pptxToPdf($inputPath, $pdfTmp);

        $result = Process::run(
            escapeshellarg($this->gs) .
            " -sDEVICE=png16m -dNOPAUSE -dBATCH -dSAFER -r150 -sOutputFile=" .
            escapeshellarg($outputPath) . " " . escapeshellarg($pdfTmp)
        );

        @unlink($pdfTmp);

        if ($result->failed()) {
            throw new \RuntimeException('PPTX to PNG rasterisation failed: ' . $result->errorOutput());
        }

        return $outputPath;
    }
}
