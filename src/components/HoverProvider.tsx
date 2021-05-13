import * as React from 'react'

type HoverProps = {
    onMouseEnter: () => void,
    onMouseLeave: () => void,
}
type ChildrenArgs = HoverProps & {
    hoverProps: HoverProps,
    isHover: boolean,
}
export type Props = {
    children: (a: ChildrenArgs) => React.ReactNode,
}
type ComponentState = {
    isHover: boolean,
}

export class HoverProvider extends React.PureComponent<Props, ComponentState> {
    public state = {
        isHover: false,
    }

    public render() {
        const hoverProps = {
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
        }
        return this.props.children({
            ...hoverProps,
            hoverProps,
            isHover: this.state.isHover,
        })
    }

    private handleMouseEnter = () => this.setState({isHover: true})
    private handleMouseLeave = () => this.setState({isHover: false})
}
