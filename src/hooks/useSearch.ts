import { useMemo, useState } from "react";

export function useSearch<T>(

    data: T[],

    getText: (item: T) => string,

) {

    const [query, setQuery] = useState("");

    const filteredData = useMemo(() => {

        if (!query) {

            return data;

        }

        return data.filter((item) =>

            getText(item)

                .toLowerCase()

                .includes(query.toLowerCase())

        );

    }, [data, query, getText]);

    return {

        query,

        setQuery,

        filteredData,

    };

}