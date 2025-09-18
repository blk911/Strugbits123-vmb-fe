import React from 'react'
import Filter from '../../../common/dashboard/Filter'

function SaloonFilter({ children, title, subTitle, classes = "" }) {
    return (
        <div className={`${classes}`}>
            {children}
            <Filter />
        </div>
    )
}

export default SaloonFilter