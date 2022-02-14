import { Select } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";
import { useState } from 'react';
import Search from 'antd/lib/input/Search';


function SearchCollections({ placeholder, setQuery }) {
    const { Option } = Select;
    const { chainId } = useMoralisDapp();
    const NFTCollections = getCollectionsByChain(chainId);
    const [searchQuery, setSearchQuery] = useState("")





    return (
        <>
            <Search
                onChange={(e) => setQuery(e.value)}
                suffix={null}
                style={{
                    width: "500px",
                    marginLeft: "10px"
                }}
                placeholder={placeholder}
                optionFilterProp="children"

            />


        </>
    )
}
export default SearchCollections;