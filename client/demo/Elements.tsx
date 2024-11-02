import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: monospace;
  line-height: 1.6;
  color: #aaa;

  & a {
    color: #fff;
    text-decoration: underline;
    &:hover {
      text-shadow: 0 0 10px #fff;
    }
  }
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 100%;
  margin: 0 auto;
  gap: 1px;
`;

export const Card = styled.div`
  padding: 30px;
`;

export const Title = styled.h1`
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0px 30px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 5px rgba(0, 255, 0, 1);
`;

export const Title1 = styled.h1`
  color: #fff;
  text-shadow: 0 0px 30px rgba(255, 255, 255, 0.5);
  font-size: 2rem;
  margin: 0 0 20px 0;
  padding: 0;
`;

export const Title2 = styled.h2`
color: #fff;
  font-size: 1rem;
  margin: 0;
`;

export const Button = styled.span`
  background-color: #f0f0ff33;
  padding: 0.5rem 1rem;
  margin: 5px 0;
  border-radius: 4px;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  color: #dddddd;
    &:hover {
        background-color: #f0f0ff55;
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
  color: #a4ef7d;
  background-color: #95d56033;
  padding: 0.1rem 0.2rem;
  margin: -0.1rem -0.2rem;
  border-radius: 4px;
`;