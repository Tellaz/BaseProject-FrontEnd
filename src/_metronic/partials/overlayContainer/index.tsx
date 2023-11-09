import styled from 'styled-components'
import {ThemeModeComponent} from '../../assets/ts/layout'

type Props = {
  children: string | JSX.Element | JSX.Element[]
}

export default function OverlayContainer({children}: Props) {
  const systemMode = ThemeModeComponent.getMode()
  const LoadingBackground = styled.div`
    background-color: rgba(0, 0, 0, 0.2);
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  `
  const Overlay = styled.div`
    background-color: ${systemMode === 'light' ? 'white' : '#1E1E2D'};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    z-index: 10;
    padding: 10px;
    padding-top: 30px;
    width: 100vw;
    height: 50vh;
  `

  return (
    <LoadingBackground>
      <Overlay>{children}</Overlay>
    </LoadingBackground>
  )
}
