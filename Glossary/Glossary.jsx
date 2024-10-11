import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import Modal from 'react-modal';

const bgColour = '#e6e6e6';
const fontColour = '#333';

const GlossaryContainer = styled.div`
  padding: 0px;
`;

const DefinitionBox = styled.div`
  background-color: ${(props) => props.bgColor || bgColour};
  color: ${(props) => props.fontColor || fontColour};
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
`;

const DefinitionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DefinitionItem = styled.li`
  margin-bottom: 10px;
`;

const Term = styled.span`
  font-weight: bold;
`;

const Definition = styled.span`
  display: block;
  margin-top: 5px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    display: 'flex',
    fontSize: '0.9rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: isFocused ? 'lightgray' : 'white',
    color: 'black',
    cursor: 'pointer',
    ':active': {
      ...styles[':active'],
      backgroundColor: 'lightgray',
    },
    ':hover': {
      backgroundColor: 'lightgray',
    },
  }),
};

const ModalImage = styled.img`
  max-width: 75vw;
  max-height: 75vh;
  height: auto;
  margin: auto;
  display: block;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
`;

const ClickableImage = styled.img`
  max-width: 100%;
  height: auto;
  cursor: pointer;
`;

export const Glossary = ({ dataDictionary, bgColor, fontColor, location }) => {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const options = useMemo(
    () => Object.keys(dataDictionary)
      .map((key) => ({
        value: key,
        label: dataDictionary[key].title,
        content: dataDictionary[key].content,
        exclude: dataDictionary[key].exclude,
      }))
      .filter(option => !location || !option.exclude.includes(location))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [dataDictionary, location]
  );

  const handleSelection = (selected) => {
    setSelectedTerm(selected);
  };

  const handleImageClick = (src) => {
    setModalImageSrc(src);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImageSrc('');
  };

  const renderContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = Array.from(doc.querySelectorAll('img'));

    // Remove images from the content for separate rendering
    images.forEach((img) => {
      img.onclick = () => handleImageClick(img.src);
      img.style.cursor = 'pointer';
      img.remove();
    });

    return {
      images: images,
      html: doc.body.innerHTML,
    };
  };

  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  return (
    <GlossaryContainer>
      Get help/explanation using the search box:
      <Select
        styles={customStyles}
        options={options}
        placeholder="Search glossary..."
        menuPortalTarget={document.body}
        onChange={handleSelection}
        isClearable
      />
      {selectedTerm && (
        <DefinitionBox bgColor={bgColor} fontColor={fontColor}>
          <DefinitionList>
            <DefinitionItem>
              <Term>{selectedTerm.label}</Term>
              <Definition dangerouslySetInnerHTML={{ __html: renderContent(selectedTerm.content).html }} />
              <ImageWrapper>
                {renderContent(selectedTerm.content).images.map((img, index) => (
                  <ClickableImage
                    key={index}
                    src={img.src}
                    alt={img.alt || ""}
                    onClick={() => handleImageClick(img.src)}
                  />
                ))}
              </ImageWrapper>
            </DefinitionItem>
          </DefinitionList>
        </DefinitionBox>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10001
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '8px',
            padding: '20px'
          },
        }}
      >
        <ModalImage src={modalImageSrc} alt="Modal Content" />
        <CloseButton onClick={closeModal}>Close</CloseButton>
      </Modal>
    </GlossaryContainer>
  );
};
