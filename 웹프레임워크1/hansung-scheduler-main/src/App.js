import { NextUIProvider } from "@nextui-org/react";
import Header from "components/Header";
import Background from "components/Background";
import Main from "pages/Main";
import { RecoilRoot } from "recoil";

function App() {
    return (
        <RecoilRoot>
            <NextUIProvider>
                <Header />
                <Main />
                <Background />
            </NextUIProvider>
        </RecoilRoot>
    );
}

export default App;