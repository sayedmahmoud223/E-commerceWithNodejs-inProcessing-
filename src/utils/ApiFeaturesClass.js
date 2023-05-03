

export class ApiFeatures {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }

    paginate() {
        let { page, size } = this.queryData
        // if ((this.queryData.page && this.queryData.size) || this.queryData.size) {
            let skip = (page - 1) * size
            if (!page || page <= 0) {
                page = 1
            }
            if (!size || size <= 0) {
                size = 2
            }
            this.mongooseQuery.limit(size).skip(skip)
        // }
        return this
    }


    filter() {
        let filterQuery = { ...this.queryData }
        let exclude = ["sort", "skip", "limit", "search", "page", "fields","size"]
        exclude.forEach((ele) => {
            if (filterQuery[ele]) {
                delete filterQuery[ele]
            }
        })
        filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|ne)/g, match => `$${match}`));
        this.mongooseQuery.find(filterQuery)
        return this
    }


    sort() {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.replaceAll(",", " "));
        }
        return this;
    }



  
  search() {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.search, $options: "i" } },
          { description: { $regex: this.queryData.search, $options: "i" } },
        ],
      });
    }
    return this;
  }


    select() {
        if (this.queryData.fields) {
            this.mongooseQuery.select(this.queryData.fields.replaceAll(",", " "));
        }
        return this;
    }
}