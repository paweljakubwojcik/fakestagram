import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'

type SearchBarProps = ComponentPropsWithoutRef<"div">

export const SearchBar: FC<SearchBarProps> = ({className}) => {
    return <div className={classnames("", className)}>SearchBar</div>
}
