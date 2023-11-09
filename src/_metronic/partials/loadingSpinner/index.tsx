import styled, {keyframes} from 'styled-components'
import {FC} from 'react'

type Props = {
  size?: number
  seconds?: number
}

const LoadingSpinner: FC<Props> = ({size, seconds}) => {
  const minSize = 24
  const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
  `
  const Spinner = styled.div`
    animation: ${rotate360} ${seconds ? `${seconds}s` : `1s`} linear infinite;
    transform: translateZ(0);
    border-top: 2px solid grey;
    border-right: 2px solid grey;
    border-bottom: 2px solid grey;
    border-left: 4px solid black;
    background: transparent;
    width: ${size ? `${minSize * size}px` : `24px`};
    height: ${size ? `${minSize * size}px` : `24px`};
    border-radius: 50%;
  `

  return <Spinner />
}

export default LoadingSpinner
