import { TestModel } from '../schemas/test';


class Test {
    static async create({ newTest }) {
        const createdNewTest = await TestModel.create(newTest);
        //string화 되어있는 content필드를 json화
        createdNewTest._doc["content"] =  JSON.parse(createdNewTest._doc["content"]);
        return createdNewTest;
    }

    static async findByNum({ num }) {
        const test = await TestModel.findOne({ num }, {__v: 0});
        //string화 되어있는 content필드를 json화
        test._doc["content"] = JSON.parse(test._doc["content"]);
        return test;
    }

    static async findByQuestion({ question }){
        const test = await TestModel.findOne({ question }, {content: 0, choices: 0, __v: 0});
        //string화 되어있는 content필드를 json화
        test._doc["content"] = JSON.parse(test._doc["content"]);
        return test;
    }

    static async findByRegex(query){
        //query가 undefined면 TestModel.find(query)는 TestModel.find() 와 동일
        const tests = await TestModel.find(query, { __v: 0 }).sort({ num: 1 });

        //string화 되어있는 content필드를 json화
        modifiedTests = tests.map(test => {
            test._doc["content"] = JSON.parse(test._doc["content"]);
            return test;
        })
        return modifiedTests;
    }

    static async countDocs(){
        const counts = await TestModel.estimatedDocumentCount();
        return counts;
    }

    static async update({ num, toUpdate }) {
        const filter = { num };
        const option = { returnOriginal: false };

        const updatedTest = await TestModel.findOneAndUpdate(
            filter,
            toUpdate,
            option
        );

        //string화 되어있는 content필드를 json화
        updatedTest._doc["content"] = JSON.parse(updatedTest._doc["content"]);

        return updatedTest;
    }

    static async delete({ num }) {
        const deletedTest = await TestModel.deleteOne({ num });
        return deletedTest;
    }
}

export { Test };