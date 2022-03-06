import styled from "styled-components";
import {
  borderRadius,
  colors,
  fontSize,
  fontWidth,
  responsiveWidths,
} from "assets/style/variables";

export const Card = styled.section`
  width: 300px;
  max-width: 270px;
  height:400px;
  cursor:pointer;
  background-color: ${colors.White};
  transition: all 0.5s ease-in;
 
  border-radius: ${borderRadius.primary};
  .card__info-row {
    padding:10px 15px;
  }
  .card__img {
    height: 60%;
    width: 100%;
    background-image: url( ${(props) => props.image});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    border-radius: ${borderRadius.primary};
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    
      .card__visible {
        visibility: ${(props) => props.onMarket ? "visible" : "hidden"};
        opacity: 0.9;
        transform: translateY(0);
        background-color: ${colors.gray};
      }
    
    &:hover{
      transform: scale(1.1)
      
    }
  }
  .card__visible {
    visibility: hidden;
    cursor: pointer;
    opacity: 0;
    transform: translateY(100px);
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    // .card__visible-icon {
    // }
  }
  .card__text-cont {
    
    h3 {
      padding:10px 15px;
      font-weight: ${fontWidth.bold};
      color: ${colors.black};
      font-size: ${fontSize.large};
      cursor: pointer;
      transition: 0.2s;
      &:hover {
        color: ${colors.hoverColor};
      }
    }
    span{
      padding:10px 15px;
      font-weight: ${fontWidth.bold};
      color: ${colors.hoverColor};
      font-size: ${fontSize.medium};
      cursor: pointer;
      transition: 0.2s;
    }
    p {
      padding:0px 10px;
      overflow:hidden;
      font-size: ${fontSize.medium};
      font-weight: ${fontWidth.regular};
      color: ${colors.darkBlueCardBG};
    }
  }
  .card__info-box-left {
  
    color: ${colors.darkBlueCardBG};
    gap: 10px;
    font-weight: ${fontWidth.semiBold};
    font-size: ${fontSize.xlarge};
  }
  .card__info-box-right {

    color: ${colors.softBlue};
    gap: 5px;
    font-size: ${fontSize.small};
  }
  .card__footer {
    padding:10px ;
    // border-top: 10px solid ${colors.darkBlueLine};
    
    margin: 20px 0 0 0;
    .avatar {
      width: 30px;
      height: 30px;
      border: 1px solid ${colors.White};
      border-radius: 50%;
      img {
        width: 100%;
      }
    }
    p {
      font-size: ${fontSize.small};
      color: ${colors.darkBlueLine};
      font-weight:${fontWidth.semiBold};
     
       overflow: hidden;
      span {
        color: ${colors.darkBlueCardBG};
        font-weight:${fontWidth.regular};
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          color: ${colors.darkBlueCardBG};
        }
      }
    }
  }
  @media (max-width: ${responsiveWidths.mabile}) {
    height: 80vh;
    .card__text-cont{
      margin: 10px 0;
    }
    .card__footer{
      padding: 10px 0;
      margin: 5px 0 0 0;
    }
  }
`;

export const BoxShadow = styled.div`
  box-shadow: 0 18px 2px  ${(props) => props.size || '15px'}  ${({ color }) => color};
  border-radius: ${borderRadius.primary};
`;