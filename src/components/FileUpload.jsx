import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.sgf')) {
      alert('Please select a valid SGF file (.sgf extension)');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-purple-400 bg-purple-400/10'
            : 'border-white/30 bg-white/5 hover:bg-white/10'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".sgf"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {!fileName ? (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-purple-400" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload SGF File</h3>
              <p className="text-white/70 mb-4">
                Drag and drop your SGF file here, or click to browse
              </p>
              <button
                onClick={handleButtonClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Choose File
              </button>
            </div>
            <p className="text-sm text-white/50">
              Supports .sgf files only
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileText className="h-12 w-12 mx-auto text-green-400" />
            <div>
              <h3 className="text-xl font-semibold mb-2">File Selected</h3>
              <p className="text-white/80 mb-4">{fileName}</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleButtonClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Change File
                </button>
                <button
                  onClick={clearFile}
                  className="bg-white/10 px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all"
                >
                  <X className="h-4 w-4 inline mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <h4 className="text-lg font-semibold mb-2">What is SGF?</h4>
        <p className="text-white/70 text-sm">
          SGF (Smart Game Format) is the standard file format for storing GO game records. 
          It contains all the moves, game information, and annotations from a GO game.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
