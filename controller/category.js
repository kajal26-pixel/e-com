function createcate(ab,parentId=null){
    try{
        let categories=ab
        var categorylist=[]
        let category
        if(parentId==null){
            category=categories.filter(cat=>cat.parentId==undefined)
        }
        else{
            category=categories.filter(cat=>cat.parentId==parentId)
        }
        for(let cate of category){
            categorylist.push({
                _id:cate._id,
                name:cate.name,
                slug:cate.slug,
                children:createcate(categories,cate._id)
            })
        }
        return(categorylist)
    }
    catch(err){ 
        return err
    }
}

function sublisting(category,categories){
    var categorylist=[]
    let child=categories.filter(cat=>cat.parentId==category._id)
    for(let cate of child){
        categorylist.push({
            _id:cate._id,
            name:cate.name,
            slug:cate.slug,
            children:sublisting(cate,categories)
        })
    }
    return categorylist
}

exports.createcate=createcate
exports.sublisting=sublisting
