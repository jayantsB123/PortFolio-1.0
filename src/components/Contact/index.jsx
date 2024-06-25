import React, {useState} from "react";
import styled from "styled-components";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Snackbar } from "@mui/material";
import Vortex from '../IntUI/vortex';
import IconCloudDemo from "../IntUI/skillUI";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  @media (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1600px;
  padding: 0px 0px 80px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: rgba(17, 25, 40, 0.83);
  padding: 32px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: rgba(23, 92, 230, 0.5) 0px 4px 36px;
  margin-top: 28px;
  gap: 12px;
`;

const ContactTitle = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactButton = styled.input`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  background: -moz-linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  background: -webkit-linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  padding: 13px 16px;
  margin-top: 2px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;

  &:hover {
    transform: scale(1.05);
    transition: all 0.2s ease-in-out;
    box-shadow:  20px 20px 60px #1F2634;
    filter: brightness(1);
    }    

`;


const Contact = () => {
  //hooks
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === '' || name.trim() === '' || message.trim() === '') {
      // Handle the case where any of the required fields is empty
      console.log('Please fill in all required fields.');
      return;
    }


    emailjs.sendForm('service_4g0lebo', 'template_ws1872z', form.current, 'TraRxqrGwGOwvpb7i')
      .then((result) => {
        setOpen(true);
        form.current.reset();
        setEmail('');
        setName('');
        setMessage('');
      }, (error) => {
        console.log(error.text);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state based on the input field name
    if (name === 'from_email') {
      setEmail(value);
    } else if (name === 'from_name') {
      setName(value);
    } else if (name === 'message') {
      setMessage(value);
    }
  };

  const isSubmitDisabled = email.trim() === '' || name.trim() === '' || message.trim() === '';

  return (
    <Container>
      <Wrapper>
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden">
      
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
        <Title>Contact</Title>
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
        <Desc>
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        </p>
      </Vortex></div>
      {/* <Wrapper>
        <IconCloudDemo />
      </Wrapper> */}
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput
            placeholder="Your Email"
            name="from_email"
            value={email}
            onChange={handleInputChange}
          />
          <ContactInput
            placeholder="Your Name"
            name="from_name"
            value={name}
            onChange={handleInputChange}
          />
          <ContactInput
            placeholder="Subject"
            name="subject"
            onChange={handleInputChange}
          />
          <ContactInputMessage
            placeholder="Message"
            rows="4"
            name="message"
            value={message}
            onChange={handleInputChange}
          />
          <ContactButton type="submit" value="Send" disabled={isSubmitDisabled} />
        </ContactForm>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          message="Email sent successfully!"
          severity="success"
        />
      </Wrapper>
    </Container>
  );
};

export default Contact;