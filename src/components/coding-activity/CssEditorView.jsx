import React from 'react'
import CodeMirrorEidtor from './CodeMirrorEidtor'
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import MonacoCodeEditor from './MonacoCodeEditor';

const CssEditorView = () => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const handleOnChange = (e) => {
        // window.location.reload();
        dispatchUiData({ type: 'setContent', payload: { key: 'cssdata.all', data: e } });
        // console.log("changing css data")
    }
    const handleChangeWithDebounce = debounce(
        handleOnChange, 5000
    )


    return (
        <div>
            <MonacoCodeEditor
             value={uiData?.uiContent?.cssdata?.all || ""}
             onChange={(e) => handleChangeWithDebounce(e)}
             height={"97vh"}
             width={"100%"}
             language="css"
             highlight={uiData.highlightClass}
            />
            {/* <CodeMirrorEidtor
                value={uiData?.uiContent?.cssdata?.all || ""}
                onChange={(e) => handleChangeWithDebounce(e)}
                height={"97vh"}
                language="css"
                highlights={[
                    { from: { line: 0, ch: 0 }, to: { line: 2, ch: 5 }, className: 'highlight' }
                ]}
            /> */}
        </div>
    )
}

export default CssEditorView