import React, { useEffect, useState } from 'react';
import './AsciiTitle.css';

const AsciiTitle: React.FC = () => {
  const [text, setText] = useState('');
  const title = "Donate Me";
  const asciiArt = `
  ██████╗  ██████╗ ███╗   ██╗ █████╗ ████████╗███████╗    ███╗   ███╗███████╗
  ██╔══██╗██╔═══██╗████╗  ██║██╔══██╗╚══██╔══╝██╔════╝    ████╗ ████║██╔════╝
  ██║  ██║██║   ██║██╔██╗ ██║███████║   ██║   █████╗      ██╔████╔██║█████╗  
  ██║  ██║██║   ██║██║╚██╗██║██╔══██║   ██║   ██╔══╝      ██║╚██╔╝██║██╔══╝  
  ██████╔╝╚██████╔╝██║ ╚████║██║  ██║   ██║   ███████╗    ██║ ╚═╝ ██║███████╗
  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝╚══════╝
  `;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= asciiArt.length) {
        setText(asciiArt.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1);

    return () => clearInterval(interval);
  }, []);

  return <pre className="ascii-title">{text}</pre>;
};

export default AsciiTitle; 