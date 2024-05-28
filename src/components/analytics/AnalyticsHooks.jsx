import React from 'react';
import { api } from '@/utils/apibase';
import { getToken } from '@/utils/token';

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
            headers: {
                Authorization: `Bearer ${getToken('token')}`,
            },
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
            console.error(error);
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
export const useUpdateFeatureEngineeringCode = () => {
    const [loading, setLoading] = React.useState(false);
    const update = async (id, code) => {
        const config = {
            method: 'PUT',
            url: '/api/coding-activity/'+id,
            headers:{
                Authorization: `Bearer ${getToken('token')}`,
                'Content-Type': 'multipart/form-data'
            },
            data:{
                featureEngineeringCode:code
            }
        };
        setLoading(true);
        try {
            const response = await api.request(config);
            // analyticsList = response.data;
            console.log(response.data);
            setLoading(false);

        } catch (error) {
            console.error(error);
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
    return { loading, update };
};
