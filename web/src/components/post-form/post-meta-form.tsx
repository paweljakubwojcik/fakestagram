import type { FC, ComponentPropsWithoutRef } from 'react'
import classnames from 'classnames'

type PostMetaFormProps = ComponentPropsWithoutRef<"div">

export const PostMetaForm: FC<PostMetaFormProps> = ({className}) => {
    return <div className={classnames("", className)}>PostMetaForm</div>
}
