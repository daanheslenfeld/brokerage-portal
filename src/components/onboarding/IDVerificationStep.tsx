import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Upload, Camera, CheckCircle, AlertCircle, X, FileText } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

type DocumentType = 'passport' | 'id_card' | 'drivers_license';

interface UploadedFile {
  name: string;
  size: number;
  preview: string;
}

export function IDVerificationStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [documentType, setDocumentType] = useState<DocumentType>(
    (data.idDocument?.type as DocumentType) || 'passport'
  );
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null);
  const [backFile, setBackFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const documentTypes: { value: DocumentType; label: string; requiresBack: boolean }[] = [
    { value: 'passport', label: 'Paspoort', requiresBack: false },
    { value: 'id_card', label: 'ID-kaart', requiresBack: true },
    { value: 'drivers_license', label: 'Rijbewijs', requiresBack: true },
  ];

  const selectedDocType = documentTypes.find(d => d.value === documentType);
  const requiresBack = selectedDocType?.requiresBack ?? false;

  const handleFileUpload = (file: File, side: 'front' | 'back') => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Alleen afbeeldingen (JPG, PNG) en PDF bestanden zijn toegestaan.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Bestand is te groot. Maximum grootte is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        preview: e.target?.result as string,
      };

      if (side === 'front') {
        setFrontFile(uploadedFile);
      } else {
        setBackFile(uploadedFile);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, side);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontFile(null);
    } else {
      setBackFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const canProceed = frontFile && (!requiresBack || backFile);

  const handleSubmit = async () => {
    if (!canProceed) return;

    setIsProcessing(true);
    setVerificationStatus('processing');

    // Simulate document verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store the document data
    updateData({
      idDocument: {
        type: documentType,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
      },
    });

    setVerificationStatus('success');

    // Wait a bit then proceed
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsProcessing(false);
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <CreditCard className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">ID Verificatie</h2>
        <p className="text-gray-400 text-sm">
          Upload een geldig identiteitsbewijs voor verificatie
        </p>
      </div>

      <div className="space-y-6">
        {/* Document Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Type document
          </label>
          <div className="grid grid-cols-3 gap-3">
            {documentTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setDocumentType(type.value);
                  // Clear back file if switching to passport
                  if (type.value === 'passport') {
                    setBackFile(null);
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  documentType === type.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-dark-border bg-dark-surface text-gray-400 hover:border-gray-600'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
          <h4 className="font-medium text-white mb-2">Vereisten voor upload:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Document moet volledig zichtbaar zijn</li>
            <li>• Goede verlichting, geen reflecties</li>
            <li>• JPG, PNG of PDF (max 10MB)</li>
            <li>• Document moet nog geldig zijn</li>
          </ul>
        </div>

        {/* Front Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {documentType === 'passport' ? 'Paspoort pagina met foto' : 'Voorkant document'} *
          </label>
          {frontFile ? (
            <div className="relative bg-dark-surface border border-dark-border rounded-xl p-4">
              <div className="flex items-center gap-4">
                {frontFile.preview.startsWith('data:image') ? (
                  <img
                    src={frontFile.preview}
                    alt="Document preview"
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-14 bg-dark-border rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-medium truncate">{frontFile.name}</p>
                  <p className="text-gray-500 text-sm">{formatFileSize(frontFile.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <button
                    type="button"
                    onClick={() => removeFile('front')}
                    className="p-1 hover:bg-dark-border rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={(e) => handleDrop(e, 'front')}
              onDragOver={handleDragOver}
              onClick={() => frontInputRef.current?.click()}
              className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'front')}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">Sleep je bestand hierheen</p>
              <p className="text-gray-500 text-sm">of klik om te uploaden</p>
            </div>
          )}
        </div>

        {/* Back Upload (if required) */}
        {requiresBack && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Achterkant document *
            </label>
            {backFile ? (
              <div className="relative bg-dark-surface border border-dark-border rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {backFile.preview.startsWith('data:image') ? (
                    <img
                      src={backFile.preview}
                      alt="Document preview"
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-14 bg-dark-border rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{backFile.name}</p>
                    <p className="text-gray-500 text-sm">{formatFileSize(backFile.size)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <button
                      type="button"
                      onClick={() => removeFile('back')}
                      className="p-1 hover:bg-dark-border rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDrop={(e) => handleDrop(e, 'back')}
                onDragOver={handleDragOver}
                onClick={() => backInputRef.current?.click()}
                className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'back')}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-1">Sleep je bestand hierheen</p>
                <p className="text-gray-500 text-sm">of klik om te uploaden</p>
              </div>
            )}
          </div>
        )}

        {/* Processing Status */}
        {verificationStatus === 'processing' && (
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-primary">Document wordt geverifieerd...</span>
            </div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-500">Document succesvol geüpload!</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={isProcessing}
            className="flex-1 py-3 border border-dark-border text-gray-300 rounded-lg hover:border-gray-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed || isProcessing}
            className="flex-1 py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin mr-2" />
                Verwerken...
              </>
            ) : (
              <>
                Verder
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
