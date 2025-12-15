import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home, Upload, CheckCircle, X, FileText } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

type ProofType = 'utility_bill' | 'bank_statement' | 'tax_document' | 'government_letter';

interface UploadedFile {
  name: string;
  size: number;
  preview: string;
}

export function AddressProofStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [proofType, setProofType] = useState<ProofType>(
    (data.addressProof?.type as ProofType) || 'utility_bill'
  );
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const proofTypes: { value: ProofType; label: string; description: string }[] = [
    { value: 'utility_bill', label: 'Energierekening', description: 'Gas, elektriciteit of water' },
    { value: 'bank_statement', label: 'Bankafschrift', description: 'Recent bankafschrift met adres' },
    { value: 'tax_document', label: 'Belastingaangifte', description: 'Recent belastingdocument' },
    { value: 'government_letter', label: 'Overheidsbrief', description: 'Brief van gemeente of overheid' },
  ];

  const handleFileUpload = (file: File) => {
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
      setUploadedFile({
        name: file.name,
        size: file.size,
        preview: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store the document data
    updateData({
      addressProof: {
        type: proofType,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
      },
    });

    setIsProcessing(false);
    nextStep();
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-full mb-4">
          <Home className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Adresbewijs</h2>
        <p className="text-gray-400 text-sm">
          Upload een document dat je woonadres bevestigt
        </p>
      </div>

      <div className="space-y-6">
        {/* Proof Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Type document
          </label>
          <div className="space-y-2">
            {proofTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setProofType(type.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  proofType === type.value
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-border bg-dark-surface hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${proofType === type.value ? 'text-primary' : 'text-white'}`}>
                      {type.label}
                    </span>
                    <p className="text-gray-500 text-sm">{type.description}</p>
                  </div>
                  {proofType === type.value && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
          <h4 className="font-medium text-white mb-2">Document vereisten:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Document mag niet ouder zijn dan 3 maanden</li>
            <li>• Je volledige naam en adres moeten zichtbaar zijn</li>
            <li>• Het adres moet overeenkomen met je opgegeven adres</li>
            <li>• JPG, PNG of PDF (max 10MB)</li>
          </ul>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload document *
          </label>
          {uploadedFile ? (
            <div className="relative bg-dark-surface border border-dark-border rounded-xl p-4">
              <div className="flex items-center gap-4">
                {uploadedFile.preview.startsWith('data:image') ? (
                  <img
                    src={uploadedFile.preview}
                    alt="Document preview"
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-14 bg-dark-border rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-gray-500 text-sm">{formatFileSize(uploadedFile.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-dark-border rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">Sleep je bestand hierheen</p>
              <p className="text-gray-500 text-sm">of klik om te uploaden</p>
            </div>
          )}
        </div>

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
            disabled={!uploadedFile || isProcessing}
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
