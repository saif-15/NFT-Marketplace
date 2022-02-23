import Input from 'antd/lib/input/Input';

function SearchCollections({ placeholder, setQuery }) {
    return (
        <>
            <Input
                onChange={(e) => setQuery(e.target.value)}
                bordered={false}
                style={{
                    width: "350px",
                    marginLeft: "10px",
                }}
                placeholder={placeholder}
                optionFilterProp="children"

            />


        </>
    )
}
export default SearchCollections;