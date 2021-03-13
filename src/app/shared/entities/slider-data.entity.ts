export interface SliderData{
    className:string;
    classLogo:string;
    uniqueClassName:string;
    link:string;
    images:Array<SliderImageData>

}
export interface SliderImageData{
    id:number;
    sliderImage:any;
}