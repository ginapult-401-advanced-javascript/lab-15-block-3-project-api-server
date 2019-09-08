'use strict';

class CrudModel {
  constructor() {
    this.schema = schema;
  }

  create(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  read(id) {
    if(id) {
      return this.schema.findById(id);
    } else {
      return this.schema.find({})
      .then(results => {
        return {
          count: results.length,
          results: results,
        };
      });
    }
  }

  update(id, record) {
    if(id) {
      return this.schema.findByIdAndUpdate(id, record, { new: true} );
    } else return 'Update: Can not find ID.'
  }

  remove(id) {
    if(id) {
      return this.schema.findByIdAndDelete(id);
    } else return 'Delete: Can not find ID.'
  }

}

module.exports = CrudModel;