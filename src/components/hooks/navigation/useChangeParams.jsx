import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useChangeParams = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const update = (queryObject) => {
        const urlsearch = new URLSearchParams(searchParams)
        const newObj = {
        };
        for (const [key, value] of urlsearch) {
            newObj[`${key}`] = value;
        }
        const keysList = Object.keys(queryObject)
        for (const changeKey of keysList) {
            newObj[`${changeKey}`] = queryObject[`${changeKey}`];
        }
        const query = new URLSearchParams(newObj)
        router.push(pathname + '?' + query.toString())
    }
    return { update }
}
