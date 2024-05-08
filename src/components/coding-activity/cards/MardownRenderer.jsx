import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ markdownText }) => {

    materialDark.function = { color: '#DD8B3C' };
    materialDark.variable = { color: '#ffffff' };
    materialDark.string = { color: '#a4a4a4' };
    materialDark.number = { color: '#907b9a' };
    materialDark['code[class*="language-"]'].background = '#242525';
    materialDark['pre[class*="language-"]'].background = '#242525';
    materialDark['pre[class*="language-"]'].color = '#ffffff';
    materialDark['pre[class*="language-"]'].borderRadius = '10px';
    materialDark.symbol = { color: '#ffffff' };
    materialDark['code[class*="language-"]'].fontFamily = 'monospace';


    return (
        <ReactMarkdown
            
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={materialDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code style={{fontWeight:"bolder",color:"#6a16b8"}} className={className} {...props}>
                            {children}
                        </code>
                    );
                }
            }}
        >{markdownText}</ReactMarkdown>
    );
};

export default MarkdownRenderer;
