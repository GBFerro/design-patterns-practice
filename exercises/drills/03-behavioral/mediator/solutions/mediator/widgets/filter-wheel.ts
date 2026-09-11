import type { PanelMediator } from "../panel-mediator.ts";

export class FilterWheel {
  selected: string | null = null;

  constructor(private readonly mediator: PanelMediator) {}

  setSelected(selected: string | null): void {
    this.selected = selected;
    this.mediator.filterChanged(selected);
  }
}
