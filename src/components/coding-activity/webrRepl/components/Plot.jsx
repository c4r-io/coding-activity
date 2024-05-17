import React from 'react';
import './Plot.css';
import { FaArrowCircleLeft, FaArrowCircleRight, FaRegSave, FaTrashAlt } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import DrawerArround from '../../DrawerArround';

export function Plot({ plotInterface }) {
  const plotContainerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const canvasElements = React.useRef([]);
  const [selectedCanvas, setSelectedCanvas] = React.useState(null);

  React.useEffect(() => {
    plotInterface.drawImage = (img) => {
      if (!canvasRef.current) {
        return;
      }
      canvasRef.current.getContext('2d').drawImage(img, 0, 0);
    };

    plotInterface.newPlot = () => {
      const plotNumber = canvasElements.current.length + 1;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('width', '1008');
      canvas.setAttribute('height', '1008');
      canvas.setAttribute('aria-label', `R Plot ${plotNumber}`);
      canvasRef.current = canvas;
      canvasElements.current.push(canvas);
      setSelectedCanvas(plotNumber - 1);
    };
  }, [plotInterface]);

  React.useEffect(() => {
    if (!plotContainerRef.current) {
      return;
    }
    if (selectedCanvas === null) {
      plotContainerRef.current.replaceChildren();
    } else {
      const canvas = canvasElements.current[selectedCanvas];
      plotContainerRef.current.replaceChildren(canvas);
    }
    console.log("selected canvas, ", selectedCanvas);
  }, [selectedCanvas]);

  const saveImage = React.useCallback(() => {
    if (selectedCanvas === null) return;
    const link = document.createElement('a');
    link.download = `Rplot${selectedCanvas}.png`;
    link.href = canvasElements.current[selectedCanvas].toDataURL();
    link.click();
    link.remove();
  }, [selectedCanvas]);

  const clearPlots = () => {
    setSelectedCanvas(null);
    canvasElements.current = [];
  };

  const nextPlot = () => setSelectedCanvas((selectedCanvas === null) ? null : selectedCanvas + 1);
  const prevPlot = () => setSelectedCanvas((selectedCanvas === null) ? null : selectedCanvas - 1);

  return (
    <div className={`${selectedCanvas !== null ? "block" : "hidden"}`}>
      <DrawerArround>
        <div role="region" aria-label="Plotting Pane" className="plot">
          <div className="plot-header">
            <div role="toolbar" aria-label="Plotting Toolbar" className="plot-actions">
              <button
                aria-label="Previous Plot"
                disabled={!selectedCanvas}
                onClick={prevPlot}
              >
                <FaArrowCircleLeft aria-hidden="true" className="icon" />
              </button>
              <button
                aria-label="Next Plot"
                disabled={
                  selectedCanvas === null || selectedCanvas === canvasElements.current.length - 1
                }
                onClick={nextPlot}
              >
                <FaArrowCircleRight aria-hidden="true" className="icon" />
              </button>
              {/* <button
            aria-label="Save Plot"
            disabled={selectedCanvas === null}
            onClick={saveImage}
          >
            <FaRegSave aria-hidden="true" className="icon" /> Save Plot
          </button> */}
              <button
                aria-label="Clear Plots"
                disabled={selectedCanvas === null}
                onClick={(e) => {
                  clearPlots();
                  // if (confirm('Clear all plots?')) {
                  // } else {
                  //   e.stopPropagation();
                  // }
                }}
              >
                <MdClear aria-hidden="true" className="icon" />
              </button>
            </div>
          </div>
          <div className='plot-background'>
            <div ref={plotContainerRef} className="plot-container"></div>
          </div>
        </div>
      </DrawerArround>
    </div>
  );
}

export default Plot;
