import React, { useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";
import Cookies from 'js-cookie';

const Text = styled.a`
  cursor: pointer;
`;

export const TermsOfUse = ({ pageContext }) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleAccept = () => {
    Cookies.set('toc', true, { expires: 3, secure: true, sameSite: 'Lax' }); // Set the cookie to true when accepted
    setShowModal(false);
  };

  return (
    <>
      <Text onClick={() => setShowModal((showModal) => !showModal)}>
        Show terms of use
      </Text>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>
            <p className="h5">{pageContext.TermsOfUseTitle} - Terms of Use</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This data can be used by third parties as long as the source is
            clearly attributed to {pageContext.TermsOfUsestbTag}, a logo is added to any
            graphs and if online, a link is added back{" "}
            <a href={pageContext.TermsOfUseLink} target="_blank" rel="noopener noreferrer">
              to this {pageContext.TermsOfUsestbTag} webpage
            </a>
            . For our terms of use, please see the{" "}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Government Licence
            </a>
            . Use of the {pageContext.name} EV Charging Infrastructure regional requirements
            tool also indicates your acceptance of{" "}
            <a
              href="https://transportforthenorth.com/wp-content/uploads/Final-version-Disclaimer-and-Appropriate-Use-EVCI-04062024.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              this Disclaimer and Appropriate Use Statement
            </a>
            .
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAccept}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}