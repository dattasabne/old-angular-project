export class MediaQuery{
    public static isMobileDevice():boolean{
        if(window.matchMedia){
            let media = window.matchMedia("(min-width:300px) and (max-width:900px)");
            return media.matches;
        }
        return false;
    }
}
