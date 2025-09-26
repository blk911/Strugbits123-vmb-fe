import React from 'react'
import Filter from '../../../common/dashboard/Filter'

function SaloonFilter({ children, title, subTitle, classes = "", searchQuery }) {
    return (
        <div className={`${classes}`}>
            {children}
            <Filter searchQuery={searchQuery} />
        </div>
    )
}

export default SaloonFilter