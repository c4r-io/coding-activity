import mongoose from 'mongoose';

function createDynamicSchemaFromData(fields) {
    const schemaDefinition = {};
    const keys = Object.keys(fields)
    keys.forEach(key => {
        schemaDefinition[key] = { type: String };
    });

    return new mongoose.Schema(schemaDefinition);
}
// Example usage
const fields = 
    {
        name: "arash",
        age: 31
    }
;

export default function AnalyticsDynamicModel(dynamicDatas) {
    const dynamicSchema = createDynamicSchemaFromData(dynamicDatas);
    return mongoose.model('AnalyticsDynamicModel', dynamicSchema)
}
