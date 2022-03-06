import { useNativeBalance } from "hooks/useNativeBalance";
import { n4 } from "helpers/formatters";
import { EthereumIcom } from "assets/svg";
import { colors } from "assets/style/variables";
import { useEffect } from "react/cjs/react.production.min";
import { useMoralis } from "react-moralis";
function NativeBalance(props) {
  const { balance, nativeName } = useNativeBalance(props);
  
  return (
    <>
      <EthereumIcom color={colors.darkBlueCardBG} />
      <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>{`${n4.format(
        balance.formatted
      )} ${nativeName}`}</div>

    </>
  );
}

export default NativeBalance;
