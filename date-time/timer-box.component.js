import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
var OwlTimerBoxComponent = (function () {
    function OwlTimerBoxComponent() {
        this.showDivider = false;
        this.step = 1;
        this.valueChange = new EventEmitter();
        this.inputChange = new EventEmitter();
        this.inputStream = new Subject();
        this.inputStreamSub = Subscription.EMPTY;
    }
    Object.defineProperty(OwlTimerBoxComponent.prototype, "displayValue", {
        get: function () {
            return this.boxValue || this.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerBoxComponent.prototype, "owlDTTimerBoxClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    OwlTimerBoxComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.inputStreamSub = this.inputStream.pipe(debounceTime(500), distinctUntilChanged()).subscribe(function (val) {
            if (val) {
                var inputValue = coerceNumberProperty(val, 0);
                _this.updateValueViaInput(inputValue);
            }
        });
    };
    OwlTimerBoxComponent.prototype.ngOnDestroy = function () {
        this.inputStreamSub.unsubscribe();
    };
    OwlTimerBoxComponent.prototype.upBtnClicked = function () {
        this.updateValue(this.value + this.step);
    };
    OwlTimerBoxComponent.prototype.downBtnClicked = function () {
        this.updateValue(this.value - this.step);
    };
    OwlTimerBoxComponent.prototype.handleInputChange = function (val) {
        this.inputStream.next(val);
    };
    OwlTimerBoxComponent.prototype.updateValue = function (value) {
        /*if (value > this.max || value < this.min) {
            return;
        }*/
        this.valueChange.emit(value);
    };
    OwlTimerBoxComponent.prototype.updateValueViaInput = function (value) {
        /*if (value > this.max || value < this.min) {
            return;
        }*/
        this.inputChange.emit(value);
    };
    OwlTimerBoxComponent.decorators = [
        { type: Component, args: [{
                    exportAs: 'owlDateTimeTimerBox',
                    selector: 'owl-date-time-timer-box',
                    template: "<div *ngIf=\"showDivider\" class=\"owl-dt-timer-divider\" aria-hidden=\"true\"></div><button class=\"owl-dt-control-button owl-dt-control-arrow-button\" type=\"button\" tabindex=\"0\" [attr.aria-label]=\"upBtnAriaLabel\" (click)=\"upBtnClicked()\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\"><!-- <editor-fold desc=\"SVG Arrow Up\"> --> <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 451.847 451.846\" style=\"enable-background:new 0 0 451.847 451.846;\" xml:space=\"preserve\" width=\"100%\" height=\"100%\"><path d=\"M248.292,106.406l194.281,194.29c12.365,12.359,12.365,32.391,0,44.744c-12.354,12.354-32.391,12.354-44.744,0\n                        L225.923,173.529L54.018,345.44c-12.36,12.354-32.395,12.354-44.748,0c-12.359-12.354-12.359-32.391,0-44.75L203.554,106.4\n                        c6.18-6.174,14.271-9.259,22.369-9.259C234.018,97.141,242.115,100.232,248.292,106.406z\"/></svg><!-- </editor-fold> --></span></button><label class=\"owl-dt-timer-content\"><input class=\"owl-dt-timer-input\" maxlength=\"2\" [value]=\"displayValue | numberFixedLen : 2\" (input)=\"handleInputChange(valueInput.value)\" #valueInput> <span class=\"owl-hidden-accessible\">{{inputLabel}}</span></label><button class=\"owl-dt-control-button owl-dt-control-arrow-button\" type=\"button\" tabindex=\"0\" [attr.aria-label]=\"downBtnAriaLabel\" (click)=\"downBtnClicked()\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\"><!-- <editor-fold desc=\"SVG Arrow Down\"> --> <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 451.847 451.846\" style=\"enable-background:new 0 0 451.847 451.846;\" xml:space=\"preserve\" width=\"100%\" height=\"100%\"><path d=\"M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751\n                        c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0\n                        c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z\"/></svg><!-- </editor-fold> --></span></button>",
                    styles: [""],
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    OwlTimerBoxComponent.ctorParameters = function () { return []; };
    OwlTimerBoxComponent.propDecorators = {
        "showDivider": [{ type: Input },],
        "upBtnAriaLabel": [{ type: Input },],
        "upBtnDisabled": [{ type: Input },],
        "downBtnAriaLabel": [{ type: Input },],
        "downBtnDisabled": [{ type: Input },],
        "boxValue": [{ type: Input },],
        "value": [{ type: Input },],
        "min": [{ type: Input },],
        "max": [{ type: Input },],
        "step": [{ type: Input },],
        "inputLabel": [{ type: Input },],
        "valueChange": [{ type: Output },],
        "inputChange": [{ type: Output },],
        "owlDTTimerBoxClass": [{ type: HostBinding, args: ['class.owl-dt-timer-box',] },],
    };
    return OwlTimerBoxComponent;
}());
export { OwlTimerBoxComponent };
