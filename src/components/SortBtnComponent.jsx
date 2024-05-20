"use client"
import { Suspense } from 'react'
import { FaSortDown, FaSortUp } from 'react-icons/fa6';
import { useChangeParams } from '@/components/hooks/navigation/useChangeParams';

const SortBtnComponent = ({
    sortKey,
    sortOrder,
    feildKey,
    children,
}) => {
    const changeParams = useChangeParams();
    const sortData = (key) => {
        if (sortKey == key) {
            toggleOrder(key);
        } else {
            changeParams.update({ sortKey: key, sortOrder: 1 })
            // update
        }
    };
    const toggleOrder = (key) => {
        if (sortOrder == 1) {
            changeParams.update({ sortKey: key, sortOrder: -1 })
        } else {
            changeParams.update({ sortKey: key, sortOrder: 1 })
        }
    };

    return (
        <Suspense>
            <button
                className="flex items-center space-x-2"
                onClick={() => sortData(feildKey)}
            >
                <p>{children} </p>
                <div className="relative">
                    <div
                        className={`relative ${sortKey == feildKey && sortOrder == 1
                            ? "text-ui-blue"
                            : "text-ui-white-text"
                            }`}
                    >
                        <FaSortUp />
                    </div>
                    <div
                        className={`absolute top-0 left-0 ${sortKey == feildKey && sortOrder == -1
                            ? "text-ui-purple"
                            : "text-ui-white-text"
                            }`}
                    >
                        <FaSortDown />
                    </div>
                </div>
            </button>
        </Suspense>
    );
};

export default SortBtnComponent;