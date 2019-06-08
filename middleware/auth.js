export default (context) => {
    if(!context.store.getters.isAuth){
        context.redirect('/auth')
    }
}