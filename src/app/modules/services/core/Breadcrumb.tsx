import { ReactNode } from "react"
import { Link } from "react-router-dom"

export interface ArrayBreadcrumb {
    titulo: string
    path: string
}

type Props = {
    props: ArrayBreadcrumb[],
    children: ReactNode
} 

const BreadcrumbLayout = (data: Props) => {
      
    return (
    <>
        {data && data.props && (
            <ol className="breadcrumb breadcrumb-line text-muted fs-6 mt-0 fw-semibold mb-10">
                <>
                    {data.props.map((dados, index) => {
                        return <li key={index} className="breadcrumb-item h2 hover-link-name-dash text-gray-600"><Link className="text-gray-600" to={dados.path}>{dados.titulo} </Link></li>
                    })}
                    <li className="breadcrumb-item h2 text-dark">{data.children}</li>
                </>
            </ol>
        )}
    </>
  )
}

export {BreadcrumbLayout}