import styled, {keyframes} from 'styled-components'
import {FC} from 'react'

type Props = {
  children: string | JSX.Element | JSX.Element[]
}

const AguardeTextAnimated: FC<Props> = ({children}: Props) => {
  const loadingAnimation = keyframes`
  to {
    clip-path: inset(0 -1ch 0 0)
  }
  `
  const Loading = styled.div`
    display: inline-block;
    clip-path: inset(0 1ch 0 0);
    animation: ${loadingAnimation} 1s steps(4) infinite;
  `
  return <Loading>{children}</Loading>
}
