import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Table, Spin, Space } from "antd";
import { PolygonCurrency } from "./Chains/Logos";
import moment from "moment";

const styles = {
  table: {
    width: "95vw",
    fontSize: "15px",
    fontWeight: "800",
  },

};



function NFTMarketTransactions() {
  const { walletAddress } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const transactions = useMoralisQuery("EthTransactions");


  const turncate = (string) => {
    if (string.length > 35) {
      string = string.substring(0, 4) + "......." + string.substring(string.length - 10, string.length);
    }
    return string;
  }

  const data = transactions.
    data.map((item, index) => ({
      key: index,
      transaction_hash: turncate(item.attributes.hash),
      block_number: turncate(item.attributes.block_number),
      date: moment(item.attributes.createdAt).format("DD-MM-YY hh:mm A"),
      status: item.attributes.confirmed ? "Completed" : "In Progress",
      from_address: turncate(item.attributes.from_address),
      to_address: turncate(item.attributes.to_address),
      price: Moralis.Units.FromWei(item.attributes.value),
      gas_price: Moralis.Units.FromWei(item.attributes.gas)
    }));

  return (
    <>
      <div>
        {transactions.data.length != 0 ?
          <div style={styles.table}>
            <Table columns={columns} dataSource={data} />
          </div>
          : <Space size="middle" style={{
            height: "100vh",
            width: "50%"
          }} >
            <Spin size="large" />
          </Space>}
      </div>
    </>
  );
}

export default NFTMarketTransactions;
const columns = [
  {
    title: "Transaction Hash",
    dataIndex: "transaction_hash",
    key: "transaction_hash",
   filterSearch: true
  },
  {
    title: "Block Number",
    dataIndex: "block_number",
    key: "block_number",
    filterSearch: true,
    sorter: {
      compare: (a, b) => b.block_number - a.block_number,
      multiple: 1,
    },
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    filterSearch: true,
    width: "100px"
  },
  {
    title: "From Address",
    key: "from_address",
    dataIndex: "from_address",
    filterSearch: true
  },
  {
    title: "To Address",
    key: "to_address",
    dataIndex: "to_address",
    filterSearch: true
  },
  {
    title: "Price",
    key: "price",
    dataIndex: "price",
    filterSearch: true
  },
  {
    title: "Gas Price",
    key: "gas_price",
    dataIndex: "gas_price",
    filterSearch: true
  },

];