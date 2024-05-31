import React from "react";
import styled from "styled-components";

const FAQ = () => {
  return (
    <Container>
      <h2>Frequently Asked Questions</h2>
      
      <FAQItem >
        <Summary>
          What is BondZapp project?
          <ControlIcon className="control-icon-expand" />
          <ControlIcon className="control-icon-close" />
        </Summary>
        <Content>
          <p>This project will implement secure coding method for an existing web application includes: 
            Researching vulnabilities, Code reviews, Provide secure standards, Apply secure coding practices, Testing & auditing:</p>
        </Content>
      </FAQItem>
      
      <FAQItem >
        <Summary>
          Does this product have what I need?
          <ControlIcon className="control-icon-expand" />
          <ControlIcon className="control-icon-close" />
        </Summary>
        <Content>
          <p>Totally. Totally does.</p>
        </Content>
      </FAQItem>

      <FAQItem>
        <Summary>
          Can I use it all the time?
          <ControlIcon className="control-icon-expand" />
          <ControlIcon className="control-icon-close" />
        </Summary>
        <Content>
          <p>Of course you can, we won't stop you.</p>
        </Content>
      </FAQItem>
       
      <FAQItem>
        <Summary>
         Who are we?
          <ControlIcon className="control-icon-expand" />
          <ControlIcon className="control-icon-close" />
        </Summary>
        <Content>
          <p>We are a company dedicated to providing traders with the necessary resources, support, and capital to succeed in the competitive FX market. Our goal is to help traders reach their full potential by offering a range of services, including mentorship, educational materials, and advanced trading tools.</p>
        </Content>
      </FAQItem>

      <FAQItem>
        <Summary>
          Are there any restrictions?
          <ControlIcon className="control-icon-expand" />
          <ControlIcon className="control-icon-close" />
        </Summary>
        <Content>
          <p>Only your imagination my friend. Go forth!</p>
        </Content>
      </FAQItem>

      <FAQItem>
        <Summary>
          Key Rule?
          <ControlIcon className="control-icon-expand" />
          <ControlIcon className="control-icon-close" />
        </Summary>
        <Content>
          <li>We believe that success in trading requires not only skill and knowledge, but also discipline and adherence to rules.</li>
          <li>Therefore, we require all traders to follow the basic rules set out in our plan, which includes daily and total drawdown limits. We believe that this helps to manage risk and prevent large losses that could wipe out your account.</li>
          <li>In addition, we prohibit any attempts to cheat the system through glitches or high-frequency trading, as we believe in fair and ethical trading practices.</li>
          <li>That being said, we do allow traders to trade new events and to hold positions overnight or over weekends.</li>
          <li>We believe that these opportunities can lead to profitable trades and increased earnings potential. It's important to note that we are looking for profitable traders who can make us both money.</li>
          <li>Therefore, traders who consistently violate our rules or fail to generate profits may not be a good fit for our challenge.</li>
          <li>We want to work with traders who are dedicated, disciplined, and committed to achieving success in the markets.</li>
          <li>If you're ready to take your trading to the next level and generate consistent profits, we invite you to join our community and start your journey to financial freedom.</li>
        </Content>
      </FAQItem>

    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  height: 100%;
  padding-top: 100px;
  h2 {
    font-size: 50px;
  }
`;

const FAQItem = styled.details`
  width: 100%;
  min-height: 5px;
  padding: 15px 15px 15px 15px;
  margin-top: 10px;
  position: relative;
  font-size: 30px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  box-sizing: border-box;
  transition: all 1s;

  &[open] {
    min-height: 50px;
    background-color: #f6f7f8;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
  }

  summary {
    display: flex;
    justify-content: space-between;
    
    font-weight: 500;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    &:focus::after {
      content: "";
      height: 100%;
      width: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: 0 0 0 5px rebeccapurple;
    }

    &::-webkit-details-marker {
      display: none;
    }
  }
`;

const Summary = styled.summary`
  width: 100%;
`;

const Content = styled.div`
  padding-top: 20px;
  color: #000000;
  font-weight: 200px;
  font-size: 0.8em
  
`;

const ControlIcon = styled.svg`
  fill: rebeccapurple;
  transition: 0.3s ease;
  pointer-events: none;
`;

export default FAQ;
