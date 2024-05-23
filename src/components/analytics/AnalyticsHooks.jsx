import React from 'react';
import { api } from '@/utils/apibase';

export const useFilterValues = () => {
    const [loading, setLoading] = React.useState(false);
    const [filterValues, setFilterValues] = React.useState([]);
    const get = async (filterKey) => {
        const isExist = sessionStorage.getItem(`filterValues-${filterKey}`);
        if (isExist) {
            setFilterValues(JSON.parse(isExist));
            return;
        }
        const config = {
            method: 'GET',
            url: '/api/analytics/filter-values',
            params: {
                filterKey
            },
        };
        setLoading(true);
        try {
            const response = await api.request(config);
            setFilterValues(response.data.results);
            // analyticsList = response.data;
            sessionStorage.setItem(`filterValues-${filterKey}`, JSON.stringify(response.data.results));
            console.log(response.data);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
            if (error?.response?.status == 401) {
                toast.error(error.response.data.message + ', Login to try again.', {
                    position: 'top-center',
                });
                router.push('/');
            } else {
                toast.error(error.message, {
                    position: 'top-center',
                });
            }
        }
    }
    return { loading, filterValues, get };
};
