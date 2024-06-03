import React from 'react';
const StringArrayInput = ({ defaultValues, onUpdate, blurHandler, label }) => {
    const [newString, setNewString] = React.useState('');
    const [stringList, setStringsList] = React.useState(defaultValues);
    const addNewString = (e) => {
        const cAns = [...stringList, newString.toString()];
        setStringsList(cAns);
        onUpdate(cAns);
        setNewString('');
    };
    const removeOneString = (index) => {
        const incAns = JSON.parse(JSON.stringify(stringList));
        incAns.splice(index, 1);
        setStringsList(incAns);
        onUpdate(incAns);
    };
    React.useEffect(() => {
        setStringsList(defaultValues);
    }, [defaultValues]);
    return (
        <div tabIndex={1} onBlur={() => {
            if (blurHandler) {
                blurHandler()
            }
        }}>
            <div className="mb-2 relative">
                <label htmlFor="add_new_incorrect_answer" className="field_label">
                    {' '}
                    {label}
                </label>
                <input
                    type="text"
                    id="add_new_incorrect_answer"
                    className="field_input"
                    placeholder={label}
                    value={newString}
                    onInput={(e) => setNewString(e.target.value)}
                />
                <button className="add_button" onClick={() => addNewString()}>
                    Add
                </button>
            </div>
            <div className="field_group">
                <div className="-m-1 flex flex-wrap w-full">
                    {stringList?.map((newString, index) => (
                        <div className="p-1" key={index}>
                            <div className="rounded-md bg-gray-500 text-white flex justify-between mb-2">
                                <div className="px-2 py-1">
                                    {index + 1}. {newString}
                                </div>
                                <button
                                    className="remove_button"
                                    onClick={() => removeOneString(index)}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default StringArrayInput;