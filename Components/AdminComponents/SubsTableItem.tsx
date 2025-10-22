import React from "react";
type subsTableType={
    mongoId: number;
    email: string;
    date: number;
    deleteEmail: (mongoId:number)=>Promise<void>;
}
const SubsTableItem = ({email,date,mongoId,deleteEmail} :subsTableType) => {
    return(
        <tr className="bg-white border-b text-left"> 
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {email?email:"Not available"}
            </th>
            <td className="px-6 py-4">
                {new Date(date).toDateString()}
            </td>
            <td className="px-6 py-4" onClick={()=>deleteEmail(mongoId)}>
                x
            </td>
        </tr>
    )
}

export default SubsTableItem;