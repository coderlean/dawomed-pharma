import React from 'react';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';

const Report = () => {
    return (
        <div>
            <p>Report</p>
        </div>
    )
}

Report.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default Report