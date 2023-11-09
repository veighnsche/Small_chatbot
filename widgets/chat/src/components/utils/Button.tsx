import styled from "styled-components";

export const ButtonPrimary = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004499;
  }
`;

export const ButtonSecondary = styled.button`
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e6e6e6;
  }
`;