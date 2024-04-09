import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: monospace;
  line-height: 1.6;
`;

export const Title = styled.h1`
  font-family: Montserrat, sans-serif;
  font-size: 3rem;
  color: #333;
  text-shadow: 0 0px 30px rgba(0, 200, 0, 0.5);
`;
export const Title2 = styled.h2`
  font-size: 1rem;
  margin: 0;
`;

export const Card = styled.div`
  background-color: #fff;
  color: #333;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 500px;
  max-width: 800px;
  margin-bottom: 1rem;
`;

export const InnerCard = styled.div`
    background-color: #ffe;
    color: #333;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;

export const Button = styled.span`
  background-color: #f0f0ff;
  padding: 0.5rem 1rem;
  margin: 5px 0;
  border-radius: 4px;
  display: inline-block;
  color: blue;
  cursor: pointer;

    &:hover {
        background-color: #e0e0ff;
    }
    &:active {
        background-color: #d0d0ff;
    }
`;

export const Paragraph = styled.p`
  margin-bottom: 1rem;
  margin-left: 1rem;
`;

export const Code = styled.code`
  color: #456236;
  background-color: #a9c49333;
  padding: 0.1rem 0.2rem;
  margin: -0.1rem -0.2rem;
  border-radius: 4px;
`;