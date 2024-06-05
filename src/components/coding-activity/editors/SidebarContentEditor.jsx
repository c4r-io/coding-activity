import { useUploadImage } from '@/components/hooks/ApiHooks';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import debouncer from '@/utils/debouncer';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import StringArrayInput from '../StringArrayInput';
import MonacoCodeEditor from '../MonacoCodeEditor';
import StringDropdown from '@/components/dropdown/StringDropdown';

const SidebarContentEditor = () => {
    const [mystmd, setMystmd] = useState('');

    const handleMystmdChange = (e) => {
        setMystmd(e.target.value);
    };

    const handleSave = () => {
        // Implement your save logic here
        console.log('Saving mystmd:', mystmd);
    };

    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // State to store the base64 string
    const getDefaultData = () => {
        if (uiData?.activePath) {
            const splittedPath = uiData?.activePath?.path.split(".");
            const nd = splittedPath.reduce((acc, curr) => {
                if (curr) {
                    if (curr.includes('[')) {
                        const index = curr.split('[')[1].split(']')[0]
                        return acc?.[curr.split('[')[0]][index]
                    }
                    return acc?.[curr];
                }
                return acc;
            }, uiData?.uiContent)
            return nd
        } else {
            return ''
        }
    }
    const getDefaultcssContentData = () => {
        if (uiData?.activePath) {
            const splittedPath = uiData?.activePath?.cssContent.split(".");
            const nd = splittedPath.reduce((acc, curr) => {
                if (curr) {
                    if (curr.includes('[')) {
                        const index = curr.split('[')[1].split(']')[0]
                        return acc?.[curr.split('[')[0]][index]
                    }
                    return acc?.[curr];
                }
                return acc;
            }, uiData?.uiContent)
            return nd
        } else {
            return ''
        }
    }

    const handleOnChange = (e) => {
        // window.location.reload();
        dispatchUiData({ type: 'setContent', payload: { key: uiData?.activePath?.cssContent, data: e.target.value } })
        // console.log("changing css data")
    }
    const handleChangeWithDebounce = debouncer(
        handleOnChange, 1000
    )
    return (
        <div>
            {uiData?.activePath &&
                <>
                    <h4 className='text-xl'>Settings</h4>
                    {
                        uiData?.activePath?.type === 'text' &&
                        <div>
                            <h4 className='text-lg'>Edit content</h4>
                            <textarea
                                className={`bg-white text-black w-full h-56 p-1 rounded-sm`}
                                value={getDefaultData()}
                                onChange={(e) => {
                                    dispatchUiData({ type: 'setContent', payload: { key: uiData?.activePath?.path, data: e.target.value } })
                                }}
                                defaultValue={getDefaultData()}
                            />
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'image' &&
                        <div>
                            <h4 className='text-lg'>Edit image </h4>
                            <div className='w-full p-4'>
                                <div className='flex justify-center items-center w-[160px] h-[160px]'>
                                    <img className=' max-w-[160px] max-h-[160px]' src={getDefaultData()} alt="image" />
                                </div>
                            </div>
                            <div className='w-full'>
                                <textarea
                                    className={`bg-white text-black w-full p-1 rounded-sm`}
                                    value={getDefaultData()}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: uiData?.activePath?.path, data: e.target.value } })
                                    }}
                                    defaultValue={getDefaultData()}
                                />
                            </div>
                            <div className='flex flex-wrap -m-1'>
                                <div className='p-1'>
                                    <Link href={`/dashboard/files-browser?fileSelector=true`} >
                                        <button className='px-3 py-1 bg-ui-violet text-base text-white'>
                                            Brows Files
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'annotation' &&
                        <div>
                            <h4 className='text-lg'>Edit annotation </h4>
                            <div>
                                <div className='w-full'>
                                    <textarea
                                        className={`bg-white text-black w-full p-1 rounded-sm`}
                                        value={getDefaultData()?.innerText}
                                        onChange={(e) => {
                                            dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.innerText`, data: e.target.value } })
                                        }}
                                        defaultValue={getDefaultData()?.innerText}
                                    />
                                </div>

                                <div className='text-xs'>
                                    <div className='p-1 flex items-center  text-white'>
                                        <div className="w-2/5">Text </div>
                                        <input className='w-3/5 ml-1 rounded'
                                            type='color'
                                            value={getDefaultData()?.messageBoxTextColor}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.messageBoxTextColor`, data: e.target.value } })
                                            }}
                                        >
                                        </input>
                                    </div>
                                    <div className='p-1 flex items-center  text-white'>
                                        <div className="w-2/5">BG</div>
                                        <input className='w-3/5 ml-1 rounded'
                                            type='color'
                                            value={getDefaultData()?.messageBoxBgColor}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.messageBoxBgColor`, data: e.target.value } })
                                            }}
                                        >
                                        </input>
                                    </div>
                                    <div className='p-1 flex items-center  text-white'>
                                        <div className="w-2/5">Font Scale</div>
                                        <input className='w-3/5 ml-1 bg-gray-300 text-black px-2 py-1 rounded'
                                            type='number'
                                            value={getDefaultData()?.fontSize}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.fontSize`, data: e.target.value } })
                                            }}
                                        >
                                        </input>
                                    </div>
                                </div>
                                <button className='p-1 bg-red-500 rounded-lg text-xl cursor-pointer'
                                    onClick={() => {
                                        dispatchUiData({ type: 'deleteContent', payload: { key: `${uiData?.activePath?.path}` } });
                                    }}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'stringArray' &&
                        <div>
                            <h4 className='text-lg'>Edit default questions</h4>
                            <div>
                                <StringArrayInput
                                    defaultValues={getDefaultData()}
                                    onUpdate={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}`, data: e } });
                                    }}
                                />
                            </div>
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'sliderinput' &&
                        <div>
                            <h4 className='text-lg'>Edit slider</h4>
                            <div>
                                <StringDropdown
                                    optionList={["number", "options"]}
                                    defaultSelected={getDefaultData()?.sliderType}
                                    onUpdate={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.sliderType`, data: e } });
                                    }}
                                >
                                </StringDropdown>
                            </div>
                            <div>
                                <h4 className='text-lg'>Label</h4>
                                <input
                                    className={`bg-white text-black w-full p-1 rounded-sm`}
                                    value={getDefaultData()?.label}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.label`, data: e.target.value } })
                                    }}
                                    defaultValue={getDefaultData()?.label}
                                    type="text"
                                />
                            </div>
                            {getDefaultData()?.sliderType === 'number' &&
                                <div>
                                    <div>
                                        <h4 className='text-lg'>Min</h4>
                                        <input
                                            className={`bg-white text-black w-full p-1 rounded-sm`}
                                            value={getDefaultData()?.min}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.min`, data: e.target.value } })
                                            }}
                                            defaultValue={getDefaultData()?.min}
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <h4 className='text-lg'>Max</h4>
                                        <input
                                            className={`bg-white text-black w-full p-1 rounded-sm`}
                                            value={getDefaultData()?.max}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.max`, data: e.target.value } })
                                            }}
                                            defaultValue={getDefaultData()?.max}
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <h4 className='text-lg'>Step</h4>
                                        <input
                                            className={`bg-white text-black w-full p-1 rounded-sm`}
                                            value={getDefaultData()?.step}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.step`, data: e.target.step } })
                                            }}
                                            defaultValue={getDefaultData()?.step}
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <h4 className='text-lg'>Default</h4>
                                        <input
                                            className={`bg-white text-black w-full p-1 rounded-sm`}
                                            value={getDefaultData()?.value}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.value`, data: e.target.value } })
                                            }}
                                            defaultValue={getDefaultData()?.value}
                                            type="number"
                                        />
                                    </div>
                                </div>
                            }
                            {getDefaultData()?.sliderType === 'options' &&
                                <div>
                                    <div>
                                        <h4 className='text-lg'>Default</h4>
                                        <input
                                            className={`bg-white text-black w-full p-1 rounded-sm`}
                                            value={getDefaultData()?.value}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.value`, data: e.target.value } })
                                            }}
                                            defaultValue={getDefaultData()?.value}
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <h4 className='text-lg'>Options</h4>
                                        <StringArrayInput
                                            defaultValues={getDefaultData()?.options}
                                            onUpdate={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.options`, data: e } });
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                            <button
                                className='px-3 py-1 bg-red-600 text-base text-white mt-2'
                                onClick={() => {

                                    dispatchUiData({ type: 'deleteContent', payload: { key: `${uiData?.activePath?.path}` } })
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    }

                </>
            }
        </div>
    );
};

export default SidebarContentEditor;

const cssProperties = {
    color: 'color',
    backgroundColor: 'color',
    fontSize: 'number',
    width: 'number',
    height: 'number',
    margin: 'number',
    padding: 'number',
    border: 'text',
    borderRadius: 'number',
    borderWidth: 'number',
    borderColor: 'color',
    borderStyle: ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    opacity: 'number',
    zIndex: 'number',
    top: 'number',
    left: 'number',
    right: 'number',
    bottom: 'number',
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    display: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
    flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
    justifyContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    alignItems: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    overflow: ['visible', 'hidden', 'scroll', 'auto'],
    overflowX: ['visible', 'hidden', 'scroll', 'auto'],
    overflowY: ['visible', 'hidden', 'scroll', 'auto'],
    cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'not-allowed'],
    visibility: ['visible', 'hidden', 'collapse'],
    textAlign: ['left', 'right', 'center', 'justify'],
    textDecoration: ['none', 'underline', 'overline', 'line-through'],
    textTransform: ['none', 'capitalize', 'uppercase', 'lowercase'],
    lineHeight: 'number',
    letterSpacing: 'number',
    fontWeight: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    fontFamily: 'text',
    boxShadow: 'text',
    backgroundImage: 'text',
    backgroundSize: ['auto', 'cover', 'contain'],
    backgroundPosition: 'text',
    backgroundRepeat: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
    clip: 'text',
    colorScheme: ['normal', 'light', 'dark'],
    direction: ['ltr', 'rtl'],
    display: ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
    flex: 'text',
    float: ['left', 'right', 'none'],
    gridTemplateColumns: 'text',
    gridTemplateRows: 'text',
    justifySelf: ['start', 'end', 'center', 'stretch'],
    marginBottom: 'number',
    marginLeft: 'number',
    marginRight: 'number',
    marginTop: 'number',
    maxHeight: 'number',
    maxWidth: 'number',
    minHeight: 'number',
    minWidth: 'number',
    outline: 'text',
    outlineColor: 'color',
    outlineOffset: 'number',
    outlineStyle: ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    outlineWidth: 'number',
    paddingBottom: 'number',
    paddingLeft: 'number',
    paddingRight: 'number',
    paddingTop: 'number',
    pointerEvents: ['auto', 'none'],
    resize: ['none', 'both', 'horizontal', 'vertical'],
    scrollBehavior: ['auto', 'smooth'],
    transition: 'text',
    transitionDelay: 'text',
    transitionDuration: 'text',
    transitionProperty: 'text',
    transitionTimingFunction: 'text',
    userSelect: ['auto', 'none', 'text', 'all'],
    verticalAlign: ['baseline', 'sub', 'super', 'top', 'text-top', 'middle', 'bottom', 'text-bottom'],
    whiteSpace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'],
    wordBreak: ['normal', 'break-all', 'keep-all', 'break-word'],
    wordSpacing: 'number',
    writingMode: ['horizontal-tb', 'vertical-rl', 'vertical-lr'],
};

const CssEditor = () => {
    const [styles, setStyles] = useState({});
    const [selectedElement, setSelectedElement] = useState('element');

    const handleStyleChange = (property, value) => {
        setStyles({
            ...styles,
            [property]: value,
        });
    };

    return (
        <div>
            <div>
                {Object.keys(cssProperties).map((property) => (
                    <div key={property} style={{ marginBottom: '10px' }}>
                        <label>{property}</label>
                        {cssProperties[property] === 'number' && (
                            <input
                                type="number"
                                value={styles[property] || ''}
                                onChange={(e) => handleStyleChange(property, e.target.value)}
                            />
                        )}
                        {cssProperties[property] === 'color' && (
                            <input
                                type="color"
                                value={styles[property] || ''}
                                onChange={(e) => handleStyleChange(property, e.target.value)}
                            />
                        )}
                        {Array.isArray(cssProperties[property]) && (
                            <select
                                value={styles[property] || ''}
                                onChange={(e) => handleStyleChange(property, e.target.value)}
                            >
                                <option value="">Select {property}</option>
                                {cssProperties[property].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                        {cssProperties[property] === 'text' && !Array.isArray(cssProperties[property]) && (
                            <input
                                type="text"
                                value={styles[property] || ''}
                                onChange={(e) => handleStyleChange(property, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div>
                <h3>Preview</h3>
                <div id="element" style={styles}>
                    This is a preview element
                </div>
            </div>
        </div>
    );
};
