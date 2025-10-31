// src/components/ModalForm.jsx
import React from 'react';
import styled from 'styled-components';

const ModalForm = ({ isModalOpen, closeModal, modalType, formData, setFormData, handleSubmit, fileInputRef, handleImageChange }) => {
  if (!isModalOpen) return null;

  // ... (use the same styled components from your main file)
  const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;

  const ModalContent = styled.div`
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;

  const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  `;

  const ModalTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: #333;
  `;

  const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #888;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: #333;
      background: #f0f0f0;
      border-radius: 50%;
    }
  `;

  const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `;

  const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

  const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #333;
  `;

  const Input = styled.input`
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
    }
  `;

  const FileInput = styled.input`
    padding: 8px 0;
  `;

  const ImagePreview = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 8px;
    border: 1px solid #eee;
  `;

  const Button = styled.button`
    background: #000;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #333;
    }
  `;

  const handleFormChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {modalType === 'service' ? 'Add New Service' : 'Add New Project'}
          </ModalTitle>
          <CloseButton onClick={closeModal}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{modalType === 'service' ? 'Service Name' : 'Project Title'}</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={handleFormChange('name')}
              placeholder={modalType === 'service' ? 'e.g., Interior Design' : 'e.g., Kitchen Remodel'}
              required
            />
          </FormGroup>

          {modalType === 'service' && (
            <FormGroup>
              <Label>Years of Experience</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={handleFormChange('experience')}
                placeholder="e.g., 5"
                required
              />
            </FormGroup>
          )}

          {modalType === 'project' && (
            <FormGroup>
              <Label>Estimated Cost</Label>
              <Input
                type="text"
                value={formData.cost}
                onChange={handleFormChange('cost')}
                placeholder="e.g., $10,000"
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Upload Photo</Label>
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {formData.imageUrl && (
              <ImagePreview src={formData.imageUrl} alt="Preview" />
            )}
          </FormGroup>

          <Button type="submit">
            {modalType === 'service' ? 'Add Service' : 'Create Project'}
          </Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalForm;