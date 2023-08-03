import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface RecipientsProps{
    recipients:string[];
}

export default function RecipientsDisplay({recipients}:RecipientsProps) {
  
  const textAreaRef = useRef(null);
  const [badgeCount, setBadgeCount] = useState(recipients.length-1);
  const [tempReciepts, setTempReciepts] = useState(recipients);

  useEffect(() => {
    const handleResize = () => {
      if (textAreaRef.current) {
        const cellWidth = textAreaRef.current.clientWidth ;
        const textToMeasure = recipients.toString();
        
        const textWidth = getStringWidthInPixels(textToMeasure);
        const trimmeArr = getTrimmedArr(recipients.join(", "), cellWidth);

        setTempReciepts(trimmeArr);
        setBadgeCount(recipients.length - trimmeArr.length);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function getTrimmedArr(text : string, maxWidth : number) : string[] {
    let widthInPixels = getStringWidthInPixels(text+'...');
    let trimmedText = text;
    if (widthInPixels <= maxWidth) {
      trimmedText = text;
    } else {
      while (widthInPixels > maxWidth && trimmedText.length > 0) {
        trimmedText = trimmedText.slice(0, -1);
        widthInPixels = getStringWidthInPixels(trimmedText);
      }
    }
    console.log(trimmedText);
    let tmpArr = trimmedText.split(", ");
    const lstEmail = tmpArr[tmpArr.length - 1]
    
    if(recipients.indexOf(lstEmail)==-1){
      tmpArr.pop();
    }
   
    if(tmpArr.length==0){
      tmpArr.push(recipients[0]);
    }
    return tmpArr;
  }

  function getStringWidthInPixels(text: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context is not supported.");
    }
    const font = "16px Arial";
    const metrics = context.measureText(text);
    return metrics.width;
  }

  const CellContainer = styled.div`
    font-size: 16px;
    foreground-color: #333333;
    // padding-top: 5px;
    // padding-bottom: 5px;
    // padding-left: 10px;
    // padding-right: 10px;
    display: flex;
    `;  
    const TextArea = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
    `;
    const Badge = styled.div`
    color:white;
    font-size: 16px;
    foreground-color: #f0f0f0;
    background-color: #666666;
    border-radius: 3px;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 5px;
    padding-right: 5px;
    margin-left: auto; 
    margin-right: 0;
    `;
  
      return (
        <CellContainer>
         <TextArea ref={textAreaRef}>
          {badgeCount>0 ? (tempReciepts.join(", ") + ", ...") : tempReciepts.join(", ")}
          </TextArea>    
        {badgeCount>0 && (
            <Badge>+{badgeCount}</Badge>
        )}
        </CellContainer>
      );
};
